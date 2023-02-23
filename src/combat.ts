import {
    thirdPartyCanNamesBeHidden,
    thirdPartyGetName,
    thirdPartyPlayersSeeName,
    thirdPartyToggleSeeName,
} from '@utils/anonymous/third'
import { localize } from '@utils/foundry/localize'
import { getFlag, setFlag } from '@utils/foundry/flags'

export function canNamesBeHidden() {
    return thirdPartyCanNamesBeHidden?.() ?? false
}

export function playersSeeName(combatant: Combatant) {
    return combatant.actor?.hasPlayerOwner || (thirdPartyPlayersSeeName?.(combatant) ?? true)
}

export function togglePlayersSeeName(combatant: Combatant) {
    return thirdPartyToggleSeeName?.(combatant)
}

export function getName(combatant: Combatant) {
    return thirdPartyGetName?.(combatant) ?? localize('unknown')
}

export function toggleFreed(combatant: Combatant) {
    const immobilized = getFlag<boolean>(combatant, 'freed')
    setFlag(combatant, 'freed', !immobilized)
}
