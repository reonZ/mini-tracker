const MODULE_ID = 'monks-tokenbar'

export function hasMTB() {
    return game.modules.get(MODULE_ID)?.active
}

export function cloneIcons(list) {
    const ol = ui.combat.element.find('#combat-tracker')
    const combatants = ol.find('.combatant:has([data-control="toggleMovement"])')

    combatants.each(function () {
        const li = $(this)
        const id = li.attr('data-combatant-id')
        const icon = li.find('[data-control="toggleMovement"]')
        const clone = icon.clone(true)

        clone.on('click', () => icon.toggleClass('active'))
        icon.on('click', () => clone.toggleClass('active'))

        list.find(`[data-combatant-id="${id}"] [data-control="toggleDefeated"]`).before(clone)
    })
}

export function showOnTrackerMTB() {
    return hasMTB() && !!game.settings.get(MODULE_ID, 'show-on-tracker')
}
