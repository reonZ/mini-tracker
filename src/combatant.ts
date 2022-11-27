import { localize } from './@utils/foundry/i18n'
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
