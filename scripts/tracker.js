import { hideCreaturesName, playersCanSeeCombatantName } from './combatant.js'
import { getCombatantFlag, getSetting, setCombatantFlag, setSetting, templatePath } from './utils/foundry.js'
import { socketEmit } from './utils/socket.js'

export class MiniTracker extends Application {
    constructor() {
        super()

        const { left, bottom, top } = /** @type {TrackerCoords} */ (getSetting('coords'))
        if (typeof left === 'number') this.position.left = left
        if (typeof top === 'number') this.position.top = top
        if (typeof bottom === 'number') this.position.bottom = bottom

        const expanded = getSetting('expanded')
        this._isExpanded = expanded !== 'false'
        this._maxHeight = expanded !== 'false' && expanded !== 'true' ? parseInt(expanded) : undefined

        this._isReversed = /** @type {boolean} */ (getSetting('reversed'))

        this._dragging = false

        this._lastCombat = ''
        this._lastCombatant = ''

        this._lastMoveTime = 0

        this._dragHook = this.#onDrag.bind(this)
        this._dragEndHook = this.#onDragEnd.bind(this)

        this._resizeHook = this.#onResize.bind(this)
        this._resizeEndHook = this.#onResizeEnd.bind(this)

        this._renderHook = Hooks.on('renderCombatTracker', () => this.render())
        this._hoverHook = Hooks.on('hoverToken', this.#onTokenHover.bind(this))

        this._coordsDebounce = debounce(this.#setCoords, 1000)
        this._expandedDebounce = debounce(this.#setExpanded, 1000)
    }

    /** @returns {ApplicationOptions} */
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            popOut: false,
            minimizable: false,
            template: templatePath('tracker.html'),
        }
    }

    get isReversed() {
        return this._isReversed
    }

    set isReversed(value) {
        this._isReversed = value
        this.render()
        setSetting('reversed', value)
    }

    get isExpanded() {
        return this._isExpanded
    }

    set isExpanded(value) {
        this._isExpanded = value
        if (value) this.#expandList()
        else this.#collapseList()
        this.#setExpanded()
    }

    get isDragging() {
        return this._dragging
    }

    set isDragging(value) {
        this.element.toggleClass('dragging', value)
        this._dragging = value
    }

    get moveTick() {
        const now = Date.now()
        if (now - this._lastMoveTime < 1000 / 60) return false
        this._lastMoveTime = now
        return true
    }

    get innerElement() {
        return this.element.find('.__inner')
    }

    get combatantElements() {
        return this.element.find('.combatant')
    }

    get listElement() {
        return this.element.find('.__inner > ol')
    }

    get combatantHeight() {
        if (this._combatantHeight) return this._combatantHeight
        this._combatantHeight = this.combatantElements.filter('.active').outerHeight(true)
        return /** @type {number} */ (this._combatantHeight)
    }

    get boxHeight() {
        if (this._boxHeight) return this._boxHeight
        const height = /** @type {number} */ (this.element.outerHeight(true))
        const listHeight = /** @type {number} */ (this.listElement.innerHeight())
        this._boxHeight = height - listHeight
        return this._boxHeight
    }

    get innerMargins() {
        if (this._innerMargins) return this._innerMargins
        const inner = this.innerElement
        this._innerMargins = parseInt(inner.css('margin-top')) + parseInt(inner.css('margin-bottom'))
        return this._innerMargins
    }

    get minHeight() {
        return this.combatantHeight + this.boxHeight
    }

    get maxHeight() {
        return this._maxHeight
    }

    set maxHeight(value) {
        this._maxHeight = value
        this._expandedDebounce()
    }

    async getData() {
        const combat = ui.combat.viewed
        if (!combat || !combat.turns.some(x => x.isOwner)) {
            return { hasCombat: false }
        }

        const data = await ui.combat.getData()

        if (!data.turns.find(x => x.active)) {
            const active = Math.min(data.turn ?? 0, data.turns.length - 1)
            const combatant = data.turns[active]
            combatant.active = true
            const css = combatant.css ? combatant.css.split(' ') : []
            css.push('active')
            combatant.css = css.join(' ')
        }

        const hideNames = hideCreaturesName()
        if (hideNames) {
            const combatants = combat.combatants
            const name = getSetting('creature')
            const isGM = game.user.isGM

            data.turns.forEach(x => {
                const combatant = /** @type {Combatant} */ (combatants.get(x.id))
                const canSeeName = playersCanSeeCombatantName(combatant)
                x.playersCanSeeName = canSeeName
                if (isGM) x.hasPlayerOwner = combatant.hasPlayerOwner
                else if (!combatant.hasPlayerOwner && !canSeeName) x.name = name
            })
        }

        const innerCss = /** @type {string[]} */ ([])
        if (this.isExpanded) innerCss.push('expanded')
        if (this.isReversed) innerCss.push('reversed')

        return {
            ...data,
            hideNames,
            innerCss: innerCss.join(' '),
        }
    }

    /** @param {JQuery} $html */
    _contextMenu($html) {
        this._menu = ContextMenu.create(this, $html, '.combatant', ui.combat._getEntryContextOptions())
    }

    /**
     * @param {boolean} [force]
     * @param {any} [options]
     * @returns
     */
    render(force, options) {
        const combat = ui.combat.viewed

        const combatId = combat?.id ?? ''
        const combatant = combat?.combatant
        const token = combatant?.token

        if (game.user.isGM && this._lastCombat === combatId && combatant && this._lastCombatant !== combatant.id) {
            if (token && getSetting('pan') && combatant.visible) {
                canvas.animatePan({ x: token.x, y: token.y })
            }
            if (combatant && !combatant.hasPlayerOwner) {
                if (token?.object && getSetting('select')) token.object.control({ releaseOthers: true })

                const sheet = combatant.actor?.sheet
                if (sheet && getSetting('sheet')) sheet.render(true)
            }
        }

        this._lastCombat = combatId
        this._lastCombatant = combatant?.id ?? ''

        return super.render(force, options)
    }

    close() {
        Hooks.off('renderCombatTracker', this._renderHook)
        Hooks.off('hoverToken', this._hoverHook)
        return super.close()
    }

    /** @param {JQuery} $html */
    activateListeners($html) {
        const combat = ui.combat.viewed
        if (!combat || !this.innerElement.length) return

        const tracker = ui.combat

        $html.find('.draggable').on('mousedown', this.#onDragStart.bind(this))
        $html.find('.__resizer').on('mousedown', this.#onResizeStart.bind(this))

        const $list = $html.find('.__inner > ol')
        $list.on('mouseenter', this.#onListHover.bind(this))
        $list.on('mouseleave', this.#onListOut.bind(this))

        $html.find('[data-control=trackerReverse]').on('click', () => (this.isReversed = !this.isReversed))
        $html.find('[data-control=trackerExpand]').on('click', () => (this.isExpanded = !this.isExpanded))

        $html.find('.combat-control').on('click', tracker._onCombatControl.bind(tracker))
        $html.find('.combatant-control').on('click', tracker._onCombatantControl.bind(tracker))

        const combatants = $list.find('.combatant')
        combatants.on('mouseenter', tracker._onCombatantHoverIn.bind(tracker))
        combatants.on('mouseleave', tracker._onCombatantHoverOut.bind(tracker))

        if (!game.user.isGM) return

        this._contextMenu($html)
        this.#makeSortable()

        $html.find('[data-control=trackerSettings]').on('click', () => new CombatTrackerConfig().render(true))

        if (game.system.id !== 'pf2e') {
            $html.find('[data-control=toggle-name-visibility]').on('click', this.#togglePlayersCanSeeName.bind(this))
        }

        combatants.on('click', tracker._onCombatantMouseDown.bind(tracker))
    }

    /** @param {{left: number, top?: number, bottom?: number}} options */
    setPosition({ left, top, bottom }) {
        const el = this.element[0]
        const currentPosition = this.position
        const minHeight = this.minHeight

        const height = el.offsetHeight
        const width = el.offsetWidth
        const winHeight = window.innerHeight
        const winWidth = window.innerWidth

        left = left ?? winWidth / 2 - width / 2
        top = top ?? winHeight / 2 - height / 2
        bottom = bottom ?? winHeight / 2 - height / 2

        const maxLeft = Math.max(winWidth - width, 0)
        currentPosition.left = Math.clamped(left, 0, maxLeft)
        el.style.left = currentPosition.left + 'px'

        if (this.isReversed) {
            if (bottom + minHeight > winHeight) bottom = winHeight - minHeight
            if (bottom < 0) bottom = 0
            el.style.bottom = bottom + 'px'
            currentPosition.bottom = bottom
            currentPosition.top = winHeight - bottom - minHeight
        } else {
            if (top + minHeight > winHeight) top = winHeight - minHeight
            if (top < 0) top = 0
            el.style.top = top + 'px'
            currentPosition.top = top
            currentPosition.bottom = winHeight - top - minHeight
        }

        this.#calculateHeight()

        return currentPosition
    }

    /** @param {number} [tmpHeight] */
    #calculateHeight(tmpHeight) {
        const inner = this.innerElement
        if (!inner.length) return

        const winHeight = window.innerHeight

        let maxHeight

        if (this.isReversed) maxHeight = winHeight - (this.position.bottom ?? 0)
        else maxHeight = winHeight - (this.position.top ?? 0)

        if (tmpHeight && tmpHeight < maxHeight) {
            maxHeight = tmpHeight
        } else if (this.maxHeight && this.maxHeight < maxHeight) {
            maxHeight = this.maxHeight
        }

        maxHeight = Math.max(maxHeight, this.minHeight)
        maxHeight -= this.innerMargins

        inner.css('max-height', maxHeight)

        if (this.isExpanded) this.#scrollToCurrent()
    }

    /**
     * this is used only when there is no system option
     * @param {JQuery.ClickEvent<any, any, HTMLElement>} event
     * */
    async #togglePlayersCanSeeName(event) {
        event.preventDefault()
        if (!game.user.isGM) return

        const $combatant = /** @type {HTMLElement} */ (event.currentTarget.closest('.combatant'))
        const id = /** @type {string} */ ($combatant.dataset.combatantId)
        const combatant = ui.combat.viewed?.combatants.get(id)

        if (combatant) {
            const canSeeName = getCombatantFlag(combatant, 'playersCanSeeName')
            await setCombatantFlag(combatant, 'playersCanSeeName', !canSeeName)
            this.render()
            socketEmit({ type: 'refresh' })
        }
    }

    #makeSortable() {
        this._sortable = new Sortable(this.listElement[0], {
            animation: 150,
            draggable: '.combatant',
            delay: 50,
            onEnd: this.#onSortEnd.bind(this),
        })
    }

    /** @param {Sortable.SortableEvent} event */
    #onSortEnd(event) {
        const id = event.item.dataset.combatantId
        const combat = ui.combat.viewed
        const oldIndex = /** @type {number} */ (event.oldIndex)
        const newIndex = /** @type {number} */ (event.newIndex)

        if (!combat || oldIndex === newIndex || !id) return

        const turns = combat.turns
        if (turns.length <= 1) return

        const others = turns.filter(x => x.id !== id)
        const prevCombatants = others.slice(0, newIndex)
        const nextCombatants = others.slice(newIndex)

        let prevInit = prevCombatants.reverse().find(x => x.initiative != null)?.initiative
        let nextInit = nextCombatants.find(x => x.initiative != null)?.initiative

        if (nextInit == null && prevInit == null) {
            nextInit = 0
            prevInit = 2
        } else if (nextInit == null) {
            nextInit = /** @type {number} */ (prevInit) - 2
        } else if (prevInit == null) {
            prevInit = /** @type {number} */ (nextInit) + 2
        }

        // @ts-ignore
        const newInit = (prevInit + nextInit) / 2
        combat.setInitiative(id, newInit)
    }

    #scrollToCurrent() {
        const list = this.listElement
        const height = /** @type {number} */ (list.innerHeight())
        if (height === list.prop('scrollHeight')) return
        const active = list.find('> .active')[0]
        list.scrollTop(active.offsetTop - height / 2 + active.offsetHeight / 2)
    }

    /** @param {JQuery.MouseDownEvent} event */
    #onDragStart(event) {
        event.preventDefault()

        this.isDragging = true
        this._initialPosition = duplicate(this.position)
        this._initialPointer = { x: event.clientX, y: event.clientY }

        window.addEventListener('mousemove', this._dragHook)
        window.addEventListener('mouseup', this._dragEndHook)
    }

    /** @param {MouseEvent} event */
    #onDrag(event) {
        event.preventDefault()

        if (!this.moveTick) return

        const pos = /** @type {Application.Position} */ (this._initialPosition)
        const cursor = /** @type {{x: Number, y: number}} */ (this._initialPointer)
        const left = (pos.left ?? 0) + (event.clientX - cursor.x)

        if (this.isReversed) {
            this.setPosition({
                left,
                bottom: (pos.bottom ?? 0) - (event.clientY - cursor.y),
            })
        } else {
            this.setPosition({
                left,
                top: (pos.top ?? 0) + (event.clientY - cursor.y),
            })
        }

        this._coordsDebounce()
    }

    /** @param {MouseEvent} event */
    #onDragEnd(event) {
        event.preventDefault()

        this.isDragging = false
        this.#calculateHeight()

        window.removeEventListener('mousemove', this._dragHook)
        window.removeEventListener('mouseup', this._dragEndHook)
    }

    /** @param {JQuery.MouseDownEvent} event */
    #onResizeStart(event) {
        event.preventDefault()

        window.addEventListener('mousemove', this._resizeHook)
        window.addEventListener('mouseup', this._resizeEndHook)
    }

    /** @param {MouseEvent} event */
    #onResize(event) {
        event.preventDefault()

        if (!this.moveTick) return

        /** @type {number | undefined} */
        let maxHeight = event.clientY - (this.position.top ?? 0)
        if (this.isReversed) maxHeight = -(maxHeight - this.minHeight)

        maxHeight = Math.max(maxHeight, this.minHeight)

        this.#calculateHeight(maxHeight)

        const combatants = this.combatantElements.length
        const expected = combatants * this.combatantHeight + this.boxHeight

        if (maxHeight >= expected) maxHeight = undefined

        this.maxHeight = maxHeight
    }

    /** @param {MouseEvent} event */
    #onResizeEnd(event) {
        event.preventDefault()

        window.removeEventListener('mousemove', this._resizeHook)
        window.removeEventListener('mouseup', this._resizeEndHook)
    }

    /**
     * @param {Token} token
     * @param {boolean} hovered
     */
    #onTokenHover(token, hovered) {
        const combatant = token.combatant
        if (!combatant) return
        const combatants = this.combatantElements
        combatants.removeClass('hovered')
        if (hovered) combatants.filter(`[data-combatant-id="${combatant.id}"]`).addClass('hovered')
    }

    #setCoords() {
        const { left, top, bottom } = this.position
        setSetting('coords', { left, top, bottom })
    }

    #setExpanded() {
        setSetting('expanded', !this.isExpanded ? 'false' : this.maxHeight || 'true')
    }

    #expandList() {
        this.innerElement.addClass('expanded')
        this.#calculateHeight()
    }

    #collapseList() {
        if (this._listHoverHook) clearTimeout(this._listHoverHook)
        this.innerElement.removeClass('expanded')
        this._menu?.close({ animate: false })
    }

    #onListHover() {
        if (this.isExpanded) return
        const delay = getSetting('delay')
        if (delay) this._listHoverHook = setTimeout(() => this.#expandList(), delay)
        else this.#expandList()
    }

    #onListOut() {
        if (this.isExpanded) return
        this.#collapseList()
    }
}
