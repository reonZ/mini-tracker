import { hideCreaturesName, playersCanSeeCombatantName } from './combatant.js'
import { getSetting } from './utils/foundry.js'

export function renameCombatants() {
    const combat = ui.combat.viewed
    if (!combat) return

    const hideNames = hideCreaturesName()
    const name = getSetting('creature')
    const $combatants = ui.combat.element.find('.combatant')
    const combatants = combat.combatants.filter(x => !x.hasPlayerOwner)

    combatants.forEach(combatant => {
        const $name = $combatants.filter(`[data-combatant-id=${combatant.id}]`).find('.token-name h4')
        if (!hideNames) $name.text(combatant.name)
        else $name.text(playersCanSeeCombatantName(combatant) ? combatant.name : name)
    })
}
