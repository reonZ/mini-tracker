import { getFlag } from '~src/@utils/foundry/flags'
import { flagsUpdatePath, templatePath } from '~src/@utils/foundry/path'
import { getCombatTrackerConfig, getSetting, setSetting } from '~src/@utils/foundry/settings'
import { easeInQuad } from '~src/@utils/math'
import { canNamesBeHidden, getName, playersSeeName, toggleFreed, togglePlayersSeeName } from '~src/combat'
import { thirdPartyToggleSeeName } from '~src/@utils/anonymous/third'
import { cloneIcons, hasMTB, showOnTrackerMTB } from '~src/thirds/mtb'
import { getSameCombatants } from '~src/@utils/foundry/combatant'

export class MiniTracker extends Application {
    private _isExpanded: boolean
    private _maxHeight?: number
    private _dragging: boolean
    private _lastCombat: string
    private _lastCombatant: string
    private _lastMoveTime: number
    private _initialPosition: ApplicationPosition
    private _initialPointer: { x: number; y: number } = { x: 0, y: 0 }
    private _combatantHeight?: number
    private _boxHeight?: number
    private _innerMargins?: number
    private _isReversed: boolean
    private _dragHook: (event: MouseEvent) => void
    private _dragEndHook: (event: MouseEvent) => void
    private _expandedDebounce: () => void
    private _coordsDebounce: () => void
    private _menu?: ContextMenu
    private _listHoverHook?: NodeJS.Timeout
    private _resizeHook: (event: MouseEvent) => void
    private _resizeEndHook: (event: MouseEvent) => void
    private _sortable?: Sortable
    private _hooks: number[]
    private _lastTurn: number

    constructor() {
        super()

        const { left, bottom, top } = getSetting<TrackerCoords>('coords')
        if (typeof left === 'number') this.position.left = left
        if (typeof top === 'number') this.position.top = top
        if (typeof bottom === 'number') this.position.bottom = bottom

        const expanded = getSetting<string>('expanded')
        this._isExpanded = expanded !== 'false'
        this._maxHeight = expanded !== 'false' && expanded !== 'true' ? parseInt(expanded) : undefined

        this._isReversed = getSetting<boolean>('reversed')

        this._dragging = false

        this._lastCombat = ''
        this._lastCombatant = ''
        this._lastTurn = -1

        this._lastMoveTime = 0

        this._dragHook = this.#onDrag.bind(this)
        this._dragEndHook = this.#onDragEnd.bind(this)

        this._resizeHook = this.#onResize.bind(this)
        this._resizeEndHook = this.#onResizeEnd.bind(this)

        this._hooks = [
            Hooks.on('renderCombatTracker', this.#onRender.bind(this)),
            Hooks.on('hoverToken', this.#onTokenHover.bind(this)),
            Hooks.on('preCreateCombatant', this.#onPreCreateCombatant.bind(this)),
        ]

        this._coordsDebounce = debounce(this.#setCoords, 1000)
        this._expandedDebounce = debounce(this.#setExpanded, 1000)

        this._initialPosition = this.position
    }

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
        return this._combatantHeight as number
    }

    get boxHeight() {
        if (this._boxHeight) return this._boxHeight
        const height = this.element.outerHeight(true)!
        const listHeight = this.listElement.innerHeight()!
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

    async getData(options?: Partial<ApplicationOptions> | undefined) {
        const combat = ui.combat.viewed
        if (!combat || !combat.turns.some(x => x.isOwner)) {
            return { hasCombat: false }
        }

        const isGM = game.user.isGM
        const currentCombatant = combat.combatant
        const showHp = getSetting<ShowHP>('showHp')
        const hpValuePath = getSetting<string>('hpValue')
        const hpMaxPath = getSetting<string>('hpMax')
        const endTurn = getSetting<boolean>('turn')
        const reversed = this.isReversed
        const hideNames = canNamesBeHidden()
        const immobilize = getSetting<boolean>('immobilize') && !hasMTB()
        const sceneId = canvas.scene?.id
        const canPing = game.user.hasPermission('PING_CANVAS')
        const hideDefeated = getSetting<boolean>('dead') && getCombatTrackerConfig().skipDefeated
        const dim = getSetting<boolean>('dim')

        let hasActive = false
        let hasDecimals = false

        const turns: Turn[] = []
        for (const [i, combatant] of combat.turns.entries()) {
            if (!combatant.visible) continue
            if (hideDefeated && combatant.defeated && !combatant.hasPlayerOwner) continue

            let defeated = combatant.isDefeated

            const effects = new Map()
            if (combatant.actor) {
                for (const effect of combatant.actor.temporaryEffects) {
                    if (effect.getFlag('core', 'statusId') === CONFIG.specialStatusEffects.DEFEATED) defeated = true
                    else if (effect.icon) effects.set(effect.icon, { icon: effect.icon, name: effect.label })
                }
            }

            const hpValue = !!hpValuePath ? getProperty<number | undefined>(combatant, `actor.system.${hpValuePath}`) : undefined
            const hpMax = !!hpMaxPath ? getProperty<number | undefined>(combatant, `actor.system.${hpMaxPath}`) : undefined

            let hpHue
            if (hpValue !== undefined && hpMax !== undefined) {
                const x = hpValue / hpMax
                hpHue = easeInQuad(x) * 122 + 3
            }

            const initiative = combatant.initiative
            const hasRolled = initiative !== null
            if (hasRolled && !Number.isInteger(initiative)) hasDecimals = true

            const active = i === combat.turn
            if (active) hasActive = true

            let name = combatant.name
            const playersCanSeeName = playersSeeName(combatant)

            const hidden = combatant.hidden
            const hasPlayerOwner = combatant.hasPlayerOwner

            const css = []
            if (active) css.push('active')
            if (hidden) css.push('hidden')
            if (defeated) css.push('defeated')
            if (hideNames && !playersCanSeeName) {
                if (!isGM) name = getName(combatant)
                else if (dim) css.push('anonymous')
            }

            const turn: Turn = {
                id: combatant.id,
                css: css.join(' '),
                name,
                img: await ui.combat._getCombatantThumbnail(combatant),
                hidden,
                hasPlayerOwner,
                playersCanSeeName,
                freed: !immobilize || combatant === currentCombatant || !!getFlag(combatant, 'freed'),
                canImmobilize: combatant !== currentCombatant,
                defeated,
                canPing: canPing && combatant.sceneId === sceneId,
                effects: Array.from(effects.values()),
                hasRolled,
                initiative,
                owner: combatant.isOwner,
                hpValue,
                hpMax,
                hpHue,
                active,
                showHp:
                    hpValue !== undefined &&
                    showHp !== 'none' &&
                    (isGM || showHp === 'all' || (showHp === 'friendly' && hasPlayerOwner)),
            }

            turns.push(turn)
        }

        if (!turns.some(x => x.owner)) {
            return { hasCombat: false }
        }

        if (!hasActive) {
            const active = Math.min(combat.turn ?? 0, turns.length - 1)
            const combatant = turns[active]
            combatant.active = true
            const css = combatant.css ? combatant.css.split(' ') : []
            css.push('active')
            combatant.css = css.join(' ')
        }

        const innerCss = []
        if (this.isExpanded) innerCss.push('expanded')
        if (reversed && !getSetting('fake-reversed')) innerCss.push('reversed')

        const precision = CONFIG.Combat.initiative.decimals
        turns.forEach(combatant => {
            if (combatant.initiative === null) return
            combatant.initiative = (combatant.initiative as number).toFixed(hasDecimals ? precision : 0)
        })

        return {
            isGM,
            turns,
            endTurn,
            hideNames,
            immobilize,
            showHp: showHp === 'all' || showHp === 'friendly' || (showHp === 'gm' && isGM),
            hasCombat: true,
            round: combat.round,
            arrow: reversed ? 'up' : 'down',
            innerCss: innerCss.join(' '),
            isCurrentTurn: currentCombatant?.isOwner,
        }
    }

    #onRender() {
        this.render()
    }

    protected async _render(force?: boolean | undefined, options?: RenderOptions | undefined): Promise<void> {
        await super._render(force, options)
        if (game.user.isGM && showOnTrackerMTB()) cloneIcons(this.listElement)
        Hooks.callAll('renderMiniTracker', this, this.element)
    }

    render(force?: boolean, options?: any) {
        const combat = ui.combat.viewed
        const isGM = game.user.isGM
        const combatId = combat?.id ?? ''
        const combatant = combat?.combatant
        const mtb = hasMTB()
        const reveal = getSetting<boolean>('reveal')
        const revealToken = getSetting<boolean>('revealToken')
        const diffCombatant = this._lastCombatant !== combatant?.id
        const diffTurn = combat?.turn !== this._lastTurn

        if (isGM && this._lastCombat === combatId && combatant && diffCombatant && diffTurn) {
            const token = combatant?.token

            if (token && getSetting('pan') && combatant.visible) {
                canvas.animatePan({ x: token.x, y: token.y })
            }
            if (combatant && !combatant.hasPlayerOwner) {
                if (token?.object && getSetting('select')) token.object.control({ releaseOthers: true })

                const sheet = combatant.actor?.sheet
                if (sheet && getSetting('sheet')) sheet.render(true)
            }
        }

        if (isGM && combat && (this._lastCombat !== combatId || (combatant && diffCombatant && diffTurn)) && (!mtb || reveal)) {
            const flag = flagsUpdatePath('freed')

            const updates = combat.turns.reduce((combatants, combatant, i) => {
                let updated = false
                const update = { _id: combatant.id } as Record<string, unknown> & { _id: string }

                if (reveal && i === combat.turn && combatant.hidden) {
                    if (revealToken) combatant.token?.update({ hidden: false })
                    update.hidden = false
                    updated = true
                }

                if (!mtb && getFlag<boolean>(combatant, 'freed')) {
                    update[flag] = false
                    updated = true
                }

                if (updated) combatants.push(update)

                return combatants
            }, [] as EmbeddedDocumentUpdateData<Combatant>[])

            if (updates.length) combat.updateEmbeddedDocuments('Combatant', updates)
        }

        this._lastCombat = combatId
        this._lastCombatant = combatant?.id ?? ''
        this._lastTurn = combat?.turn ?? -1

        return super.render(force, options)
    }

    async close(options?: ({ force?: boolean | undefined } & Record<string, unknown>) | undefined): Promise<void> {
        const result = await super.close(options)
        this._hooks.forEach(x => Hooks.off('any', x))
        Hooks.call(`closeMiniTracker`, this, this.element)
        return result
    }

    activateListeners(html: JQuery) {
        const combat = ui.combat.viewed
        if (!combat || !this.innerElement.length) return

        const tracker = ui.combat

        html.find('.draggable').on('mousedown', this.#onDragStart.bind(this))
        html.find('.__resizer').on('mousedown', this.#onResizeStart.bind(this))

        const list = html.find('.__inner > ol')
        list.on('mouseenter', this.#onListHover.bind(this))
        html.on('mouseleave', this.#onListOut.bind(this))

        html.find('[data-control=trackerReverse]').on('click', () => (this.isReversed = !this.isReversed))
        html.find('[data-control=trackerExpand]').on('click', () => (this.isExpanded = !this.isExpanded))

        html.find('[data-control=targetCombatant]').on('click', this.#onTarget.bind(this))

        html.find('.combat-control').on('click', tracker._onCombatControl.bind(tracker))
        html.find('.combatant-control').on('click', tracker._onCombatantControl.bind(tracker))

        const combatants = list.find('.combatant')
        combatants.on('mouseenter', tracker._onCombatantHoverIn.bind(tracker))
        combatants.on('mouseleave', tracker._onCombatantHoverOut.bind(tracker))

        if (!game.user.isGM) return

        this._contextMenu(html)
        this.#makeSortable()

        html.find('[data-control=trackerSettings]').on('click', () => new CombatTrackerConfig().render(true))

        if (!hasMTB()) {
            html.find('[data-control="toggleImmobilized"]').on('click', this.#onToggleImmobilized.bind(this))
        }

        if (canNamesBeHidden() && thirdPartyToggleSeeName) {
            html.find('[data-control=toggle-name-visibility]').on('click', this.#togglePlayersCanSeeName.bind(this))
        }

        combatants.on('click', tracker._onCombatantMouseDown.bind(tracker))
    }

    setPosition({ left, top, bottom }: ApplicationPosition) {
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

    _contextMenu($html: JQuery) {
        this._menu = ContextMenu.create(this, $html, '.combatant', ui.combat._getEntryContextOptions())
    }

    #onPreCreateCombatant(combatant: Combatant, data: DocumentUpdateData<Combatant>, context: DocumentModificationContext) {
        if (context.temporary || !getSetting('hide') || combatant.hasPlayerOwner) return
        combatant.updateSource({ hidden: true })
    }

    #getCombatantFromEvent(event: JQuery.ClickEvent<any, any, HTMLElement>) {
        const $combatant = $(event.currentTarget).closest('.combatant')
        const id = $combatant.attr('data-combatant-id')!
        return ui.combat.viewed?.combatants.get(id)
    }

    #onTarget(event: JQuery.ClickEvent<any, any, HTMLElement>) {
        event.preventDefault()

        const combatant = this.#getCombatantFromEvent(event)
        const token = combatant?.token

        if (!token) return

        const current = Array.from(game.user.targets).map(x => x.id)
        const targets = event.shiftKey ? current : current.filter(x => x === token.id)
        const index = targets.indexOf(token.id)

        if (index !== -1) targets.splice(index, 1)
        else targets.push(token.id)

        game.user.updateTokenTargets(targets)
    }

    #onToggleImmobilized(event: JQuery.ClickEvent<any, any, HTMLElement>) {
        event.preventDefault()
        const combatant = this.#getCombatantFromEvent(event)
        if (combatant) toggleFreed(combatant)
    }

    async #togglePlayersCanSeeName(event: JQuery.ClickEvent<any, any, HTMLElement>) {
        event.preventDefault()
        const combatant = this.#getCombatantFromEvent(event)
        if (!combatant) return

        if (event.shiftKey && combatant.actor && combatant.actor.isToken && game.combat?.scene) {
            getSameCombatants(combatant).forEach(togglePlayersSeeName)
        } else {
            togglePlayersSeeName(combatant)
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

    #onSortEnd(event: Sortable.SortableEvent) {
        const id = event.item.dataset.combatantId
        const combat = ui.combat.viewed
        const oldIndex = /** @type {number} */ event.oldIndex
        const newIndex = /** @type {number} */ event.newIndex

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
            nextInit = /** @type {number} */ prevInit! - 2
        } else if (prevInit == null) {
            prevInit = /** @type {number} */ nextInit + 2
        }

        // @ts-ignore
        const newInit = (prevInit + nextInit) / 2
        combat.setInitiative(id, newInit)
    }

    #onResizeStart(event: JQuery.MouseDownEvent) {
        event.preventDefault()

        window.addEventListener('mousemove', this._resizeHook)
        window.addEventListener('mouseup', this._resizeEndHook)
    }

    #onResize(event: MouseEvent) {
        event.preventDefault()

        if (!this.moveTick) return

        let maxHeight: number | undefined = event.clientY - (this.position.top ?? 0)
        if (this.isReversed) maxHeight = -(maxHeight - this.minHeight)

        maxHeight = Math.max(maxHeight, this.minHeight)

        this.#calculateHeight(maxHeight)

        const combatants = this.combatantElements.length
        const expected = combatants * this.combatantHeight + this.boxHeight

        if (maxHeight >= expected) maxHeight = undefined

        this.maxHeight = maxHeight
    }

    #onResizeEnd(event: MouseEvent) {
        event.preventDefault()

        window.removeEventListener('mousemove', this._resizeHook)
        window.removeEventListener('mouseup', this._resizeEndHook)
    }

    #onDragStart(event: JQuery.MouseDownEvent) {
        event.preventDefault()

        this.isDragging = true
        this._initialPosition = duplicate(this.position)
        this._initialPointer = { x: event.clientX, y: event.clientY }

        window.addEventListener('mousemove', this._dragHook)
        window.addEventListener('mouseup', this._dragEndHook)
    }

    #onDrag(event: MouseEvent) {
        event.preventDefault()

        if (!this.moveTick) return

        const pos = this._initialPosition
        const cursor = this._initialPointer
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

    #onDragEnd(event: MouseEvent) {
        event.preventDefault()

        this.isDragging = false
        this.#calculateHeight()

        window.removeEventListener('mousemove', this._dragHook)
        window.removeEventListener('mouseup', this._dragEndHook)
    }

    #onTokenHover(token: Token, hovered: boolean) {
        const combatant = token.combatant
        if (!combatant) return
        const combatants = this.combatantElements
        combatants.removeClass('hovered')
        if (hovered) combatants.filter(`[data-combatant-id="${combatant.id}"]`).addClass('hovered')
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
        if (this.isExpanded || !getSetting('hover')) return
        const delay = getSetting<number>('delay')
        if (delay) this._listHoverHook = setTimeout(() => this.#expandList(), delay)
        else this.#expandList()
    }

    #onListOut() {
        if (this.isExpanded) return
        this.#collapseList()
    }

    #calculateHeight(tmpHeight?: number) {
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

    #scrollToCurrent() {
        const list = this.listElement
        const height = list.innerHeight()!
        if (height === list.prop('scrollHeight')) return
        const active = list.find('> .active')[0]
        list.scrollTop(active.offsetTop - height / 2 + active.offsetHeight / 2)
    }

    #setCoords() {
        const { left, top, bottom } = this.position
        setSetting('coords', { left, top, bottom })
    }
}
