import Sortable from 'sortablejs'
import { canNamesBeHidden, getCombatantColor, getName, playersSeeName, toggleFreed, togglePlayersSeeName } from '../combat.'
import {
    easeInQuad,
    flagsUpdatePath,
    getCombatTrackerConfig,
    getFlag,
    getSameCombatants,
    getSetting,
    setSetting,
    templatePath,
} from '../module'
import { cloneIcons, hasMTB, showOnTrackerMTB } from '../third/mtb'
import { thirdPartyHealthEstimate, thirdPartyToggleSeeName } from '../third'

export class MiniTracker extends Application {
    constructor() {
        super()

        const { left, bottom, top } = getSetting('coords')
        if (typeof left === 'number') this.position.left = left
        if (typeof top === 'number') this.position.top = top
        if (typeof bottom === 'number') this.position.bottom = bottom

        const expanded = getSetting('expanded')
        this._isExpanded = expanded !== 'false'
        this._maxHeight = expanded !== 'false' && expanded !== 'true' ? parseInt(expanded) : undefined

        this._isReversed = getSetting('reversed')

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
            Hooks.on('renderCombatTracker', () => this.render()),
            Hooks.on('hoverToken', this.#onTokenHover.bind(this)),
            Hooks.on('preCreateCombatant', this.#onPreCreateCombatant.bind(this)),
            Hooks.on('targetToken', this.#renderTargets.bind(this)),
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
            template: templatePath('tracker.hbs'),
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
        return this._combatantHeight
    }

    get boxHeight() {
        if (this._boxHeight) return this._boxHeight
        const height = this.element.outerHeight(true)
        const listHeight = this.listElement.innerHeight()
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

    async getData(options) {
        const isGM = game.user.isGM
        const combat = ui.combat.viewed

        if (!combat || (!isGM && getSetting('started') && !combat.started) || !combat.turns.some(x => x.isOwner)) {
            return { hasCombat: false }
        }

        const currentCombatant = combat.combatant
        const showHp = getSetting('showHp')
        const endTurn = getSetting('turn')
        const reversed = this.isReversed
        const hideNames = canNamesBeHidden()
        const immobilize = getSetting('immobilize') && !hasMTB()
        const sceneId = canvas.scene?.id
        const canPing = game.user.hasPermission('PING_CANVAS')
        const hideDefeated = getSetting('dead') && getCombatTrackerConfig().skipDefeated
        const dim = getSetting('dim')

        let hasActive = false
        let hasDecimals = false

        const healthEstimate =
            thirdPartyHealthEstimate() ??
            (() => {
                const hpValuePath = getSetting('hpValue')
                const hpMaxPath = getSetting('hpMax')
                return actor => ({
                    hpValue: !!hpValuePath ? getProperty(actor, `system.${hpValuePath}`) : undefined,
                    hpMax: !!hpMaxPath ? getProperty(actor, `system.${hpMaxPath}`) : undefined,
                })
            })()

        const turns = []
        for (const [i, combatant] of combat.turns.entries()) {
            if (!combatant.visible) continue
            if (hideDefeated && combatant.defeated && !combatant.actor?.hasPlayerOwner) continue

            let defeated = combatant.isDefeated

            const effects = new Map()
            if (combatant.actor) {
                for (const effect of combatant.actor.temporaryEffects) {
                    if (effect.statuses.has(CONFIG.specialStatusEffects.DEFEATED)) defeated = true
                    else if (effect.icon) effects.set(effect.icon, { icon: effect.icon, name: effect.label })
                }
            }

            const { hpValue, hpMax, hpTooltip } = healthEstimate(combatant.actor) ?? {}

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
            const hasPlayerOwner = !!combatant.actor?.hasPlayerOwner

            const css = []
            if (active) css.push('active')
            if (hidden) css.push('hidden')
            if (defeated) css.push('defeated')
            if (hideNames && !playersCanSeeName) {
                if (!isGM) name = getName(combatant)
                else if (dim) css.push('anonymous')
            }

            const color = getCombatantColor(combatant)

            const turn = {
                combatantId: combatant.id,
                tokenId: combatant.tokenId,
                css: css.join(' '),
                colors: {
                    border: color.css,
                    background: color.toRGBA(0.1),
                },
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
                hpTooltip,
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
            combatant.initiative = combatant.initiative.toFixed(hasDecimals ? precision : 0)
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
            fontSize: getSetting('scale'),
        }
    }

    #renderTargets() {
        const combat = ui.combat.viewed
        if (!combat) return

        const targetsIds = game.user.targets.ids
        const turns = this.element.find('.__inner ol li.combatant')

        turns.each(function () {
            const { tokenId, combatantId } = this.dataset

            const targetIcon = this.querySelector('.__details .__icons [data-control="targetCombatant"]')
            targetIcon.classList.toggle('active', targetsIds.includes(tokenId))

            const combatant = combat.combatants.get(combatantId)
            if (!combatant) return

            const targetsEl = this.querySelector('.__targets')
            targetsEl.innerHTML = ''

            const colors = combatant.token?.object?.targeted.toObject().map(user => user.color) ?? []
            for (const color of colors) {
                const div = `<div class="target" style="background-color: ${color};"></div>`
                targetsEl.insertAdjacentHTML('beforeend', div)
            }
        })
    }

    async _render(force, options) {
        await super._render(force, options)
        this.#renderTargets()
        if (game.user.isGM && showOnTrackerMTB()) cloneIcons(this.listElement)
    }

    render(force, options) {
        const combat = ui.combat.viewed
        const isGM = game.user.isGM
        const combatId = combat?.id ?? ''
        const combatant = combat?.combatant
        const immobilize = getSetting('immobilize') && !hasMTB()
        const reveal = getSetting('reveal')
        const revealToken = getSetting('revealToken')
        const diffCombatant = this._lastCombatant !== combatant?.id
        const diffTurn = combat?.turn !== this._lastTurn

        if (isGM && this._lastCombat === combatId && combatant && diffCombatant && diffTurn) {
            const token = combatant?.token

            if (token && getSetting('pan') && combatant.visible) {
                canvas.animatePan({ x: token.x, y: token.y })
            }

            if (getSetting('close-sheet')) {
                const lastCombatant = combat?.combatants.get(this._lastCombatant)
                const sheet = lastCombatant?.actor?.sheet

                if (sheet && sheet.appId in ui.windows) {
                    this._sheetCoords = sheet.position
                    sheet.close({ force: true })
                }
            }

            if (!getSetting('sheet-coords')) this._sheetCoords = undefined

            if (combatant && !combatant.actor?.hasPlayerOwner) {
                if (token?.object && getSetting('select')) token.object.control({ releaseOthers: true })

                const sheet = combatant.actor?.sheet
                if (sheet && getSetting('sheet')) {
                    sheet.render(true, this._sheetCoords ?? {})
                }
            }
        }

        if (
            isGM &&
            combat &&
            (this._lastCombat !== combatId || (combatant && diffCombatant && diffTurn)) &&
            (immobilize || reveal)
        ) {
            const flag = flagsUpdatePath('freed')

            const updates = combat.turns.reduce((combatants, combatant, i) => {
                let updated = false
                const update = { _id: combatant.id }

                if (reveal && i === combat.turn && combatant.hidden) {
                    if (revealToken) combatant.token?.update({ hidden: false })
                    update.hidden = false
                    updated = true
                }

                if (immobilize && getFlag(combatant, 'freed')) {
                    update[flag] = false
                    updated = true
                }

                if (updated) combatants.push(update)

                return combatants
            }, [])

            if (updates.length) combat.updateEmbeddedDocuments('Combatant', updates)
        }

        this._lastCombat = combatId
        this._lastCombatant = combatant?.id ?? ''
        this._lastTurn = combat?.turn ?? -1

        return super.render(force, options)
    }

    async close(options) {
        const result = await super.close(options)
        this._hooks.forEach(x => Hooks.off('any', x))
        return result
    }

    activateListeners(html) {
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

        html.find('[data-control=targetCombatant]').on('click', this.#targetCombatant.bind(this))

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

        combatants.on('click', this.#onCombatantClick.bind(this))
    }

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

    _contextMenu(html) {
        this._menu = ContextMenu.create(this, html, '.combatant', ui.combat._getEntryContextOptions())
    }

    #onCombatantClick(event) {
        event.preventDefault()

        if (event.ctrlKey) {
            const combat = ui.combat.viewed
            const combatantId = event.currentTarget.closest('.combatant').dataset.combatantId
            const turn = combat.turns.findIndex(combatant => combatant.id === combatantId)
            const currentTurn = combat.turn

            if (currentTurn === turn) return

            const direction = turn < currentTurn ? -1 : 1

            Hooks.callAll('combatTurn', combat, { turn }, { direction })
            combat.update({ turn }, { direction })
        } else {
            ui.combat._onCombatantMouseDown(event)
        }
    }

    #onPreCreateCombatant(combatant, data, context) {
        if (context.temporary || !getSetting('hide') || combatant.actor?.hasPlayerOwner) return
        combatant.updateSource({ hidden: true })
    }

    #getCombatantFromEvent(event) {
        const combatant = $(event.currentTarget).closest('.combatant')
        const id = combatant.attr('data-combatant-id')
        return ui.combat.viewed?.combatants.get(id)
    }

    #targetCombatant(event) {
        event.preventDefault()

        const combatant = this.#getCombatantFromEvent(event)
        const token = combatant?.token?.object
        if (!token) return

        const thisUser = game.user
        const targeted = token.targeted.some(user => user === thisUser)

        token.setTarget(!targeted, { releaseOthers: !event.shiftKey })
    }

    #onToggleImmobilized(event) {
        event.preventDefault()
        const combatant = this.#getCombatantFromEvent(event)
        if (combatant) toggleFreed(combatant)
    }

    async #togglePlayersCanSeeName(event) {
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

    #onSortEnd(event) {
        const id = event.item.dataset.combatantId
        const combat = ui.combat.viewed
        const oldIndex = event.oldIndex
        const newIndex = event.newIndex

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
            nextInit = prevInit - 2
        } else if (prevInit == null) {
            prevInit = nextInit + 2
        }

        const newInit = (prevInit + nextInit) / 2
        combat.setInitiative(id, newInit)
    }

    #onResizeStart(event) {
        event.preventDefault()

        window.addEventListener('mousemove', this._resizeHook)
        window.addEventListener('mouseup', this._resizeEndHook)
    }

    #onResize(event) {
        event.preventDefault()

        if (!this.moveTick) return

        let maxHeight = event.clientY - (this.position.top ?? 0)
        if (this.isReversed) maxHeight = -(maxHeight - this.minHeight)

        maxHeight = Math.max(maxHeight, this.minHeight)

        this.#calculateHeight(maxHeight)

        const combatants = this.combatantElements.length
        const expected = combatants * this.combatantHeight + this.boxHeight

        if (maxHeight >= expected) maxHeight = undefined

        this.maxHeight = maxHeight
    }

    #onResizeEnd(event) {
        event.preventDefault()

        window.removeEventListener('mousemove', this._resizeHook)
        window.removeEventListener('mouseup', this._resizeEndHook)
    }

    #onDragStart(event) {
        event.preventDefault()

        this.isDragging = true
        this._initialPosition = deepClone(this.position)
        this._initialPointer = { x: event.clientX, y: event.clientY }

        window.addEventListener('mousemove', this._dragHook)
        window.addEventListener('mouseup', this._dragEndHook)
    }

    #onDrag(event) {
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

    #onDragEnd(event) {
        event.preventDefault()

        this.isDragging = false
        this.#calculateHeight()

        window.removeEventListener('mousemove', this._dragHook)
        window.removeEventListener('mouseup', this._dragEndHook)
    }

    #onTokenHover(token, hovered) {
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
        const delay = getSetting('delay')
        if (delay) this._listHoverHook = setTimeout(() => this.#expandList(), delay)
        else this.#expandList()
    }

    #onListOut() {
        if (this.isExpanded) return
        this.#collapseList()
    }

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

    #scrollToCurrent() {
        const list = this.listElement
        const height = list.innerHeight()
        if (height === list.prop('scrollHeight')) return
        const active = list.find('> .active')[0]
        list.scrollTop(active.offsetTop - height / 2 + active.offsetHeight / 2)
    }

    #setCoords() {
        const { left, top, bottom } = this.position
        setSetting('coords', { left, top, bottom })
    }
}
