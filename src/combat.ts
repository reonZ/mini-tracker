import {
    thirdPartyCanNamesBeHidden,
    thirdPartyGetName,
    thirdPartyPlayersSeeName,
    thirdPartyToggleSeeName,
} from '@utils/anonymous/third'
import { localize } from '@utils/foundry/localize'
import { getFlag, setFlag } from '@utils/foundry/flags'
import { getPF2eDispositionColor, isPF2eSystem } from './thirds/pf2e'

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

function getCombatantDispositionColor(combatant: Combatant) {
    if (isPF2eSystem()) return getPF2eDispositionColor(combatant)

    const actor = combatant.actor
    const token = combatant.token
    if (!actor || !token) return CONFIG.Canvas.dispositionColors.NEUTRAL

    if (actor.hasPlayerOwner) return CONFIG.Canvas.dispositionColors.PARTY

    const disposition = token.disposition
    if (disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY) return CONFIG.Canvas.dispositionColors.FRIENDLY
    if (disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE) return CONFIG.Canvas.dispositionColors.HOSTILE
    return CONFIG.Canvas.dispositionColors.NEUTRAL
}

export function getCombatantColor(combatant: Combatant) {
    const dispositionColor = getCombatantDispositionColor(combatant)
    return new Color(dispositionColor)
}
