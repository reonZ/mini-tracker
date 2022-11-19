import { getCombatantFlag, getSetting } from './utils/foundry.js'

/** @param {Combatant | CombatantPF2e} combatant */
export function playersCanSeeCombatantName(combatant) {
    if (game.system.id === 'pf2e') return /** @type {CombatantPF2e} */ (combatant).playersCanSeeName
    else return getCombatantFlag(combatant, 'playersCanSeeName')
}

export function hideCreaturesName() {
    if (game.system.id === 'pf2e') {
        if (game.settings.settings.has('pf2e.metagame.tokenSetsNameVisibility'))
            return !!game.settings.get('pf2e', 'metagame.tokenSetsNameVisibility')
        else return !!game.settings.get('pf2e', 'metagame_tokenSetsNameVisibility')
    } else return !!getSetting('creature')
}
