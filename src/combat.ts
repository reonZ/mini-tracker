import { getFlag, setFlag } from './@utils/foundry/flags'
import { localize } from './@utils/foundry/i18n'
import { flagsUpdatePath } from './@utils/foundry/path'
import { thirdPartyCanNamesBeHidden, thirdPartyGetName, thirdPartyPlayersSeeName, thirdPartyToggleSeeName } from './third'

export function canNamesBeHidden() {
    return thirdPartyCanNamesBeHidden?.() ?? false
}

export function playersSeeName(combatant: Combatant) {
    return combatant.hasPlayerOwner || (thirdPartyPlayersSeeName?.(combatant) ?? true)
}

export function togglePlayersSeeName(combatant: Combatant) {
    return thirdPartyToggleSeeName?.(combatant)
}

export function getName(combatant: Combatant) {
    return thirdPartyGetName?.(combatant) ?? localize('unknown')
}

export function resetFreed(combat: Combat) {
    const flag = flagsUpdatePath('freed')
    const updates = combat.combatants.map(x => ({ _id: x._id, [flag]: false }))
    combat.updateEmbeddedDocuments('Combatant', updates)
}

export function preDeleteCombat(combat: Combat) {
    if (combat === ui.combat.viewed) resetFreed(combat)
}

export function toggleFreed(combatant: Combatant) {
    const immobilized = getFlag<boolean>(combatant, 'freed')
    setFlag(combatant, 'freed', !immobilized)
}
