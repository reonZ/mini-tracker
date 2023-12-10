import { getFlag, localize, setFlag } from './module'
import { thirdPartyCanNamesBeHidden, thirdPartyGetName, thirdPartyPlayersSeeName, thirdPartyToggleSeeName } from './third'
import { getPF2eDispositionColor, isPF2eSystem } from './third/pf2e'

export function canNamesBeHidden() {
    return thirdPartyCanNamesBeHidden?.() ?? false
}

export function playersSeeName(combatant) {
    return combatant.actor?.hasPlayerOwner || (thirdPartyPlayersSeeName?.(combatant) ?? true)
}

export function togglePlayersSeeName(combatant) {
    return thirdPartyToggleSeeName?.(combatant)
}

export function getName(combatant) {
    return thirdPartyGetName?.(combatant) ?? localize('unknown')
}

export function toggleFreed(combatant) {
    const immobilized = getFlag(combatant, 'freed')
    setFlag(combatant, 'freed', !immobilized)
}

function getCombatantDispositionColor(combatant) {
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

export function getCombatantColor(combatant) {
    const dispositionColor = getCombatantDispositionColor(combatant)
    return new Color(dispositionColor)
}
