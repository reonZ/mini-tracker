import { getModule } from '~src/@utils/foundry/module'

const MODULE_ID = 'monks-tokenbar'

export function hasMTB() {
    return !!getModule(MODULE_ID)
}

export function cloneIcons(list: JQuery) {
    const ol = ui.combat.element.find<HTMLOListElement>('#combat-tracker')
    const combatants = ol.find<HTMLLIElement>('.combatant:has([data-control="toggleMovement"])')

    combatants.each(function () {
        const li = $(this)
        const id = li.attr('data-combatant-id')!
        const icon = li.find<HTMLAnchorElement>('[data-control="toggleMovement"]')
        const clone = icon.clone(true)

        clone.on('click', () => icon.toggleClass('active'))
        icon.on('click', () => clone.toggleClass('active'))

        list.find(`[data-combatant-id="${id}"] [data-control="toggleDefeated"]`).before(clone)
    })
}

export function showOnTrackerMTB() {
    return hasMTB() && !!game.settings.get(MODULE_ID, 'show-on-tracker')
}
