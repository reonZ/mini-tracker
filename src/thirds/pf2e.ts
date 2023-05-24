const SYSTEM_ID = 'pf2e'

export function isPF2eSystem() {
    return game.system.id === SYSTEM_ID
}

export function getPF2eDispositionColor(combatant: Combatant) {
    const actor = combatant.actor as (Actor & { alliance: 'party' | 'opposition' | null }) | null
    if (!actor) return CONFIG.Canvas.dispositionColors.NEUTRAL

    const alliance = actor.alliance

    if (alliance === 'party')
        return actor.hasPlayerOwner ? CONFIG.Canvas.dispositionColors.PARTY : CONFIG.Canvas.dispositionColors.FRIENDLY

    return alliance === 'opposition' ? CONFIG.Canvas.dispositionColors.HOSTILE : CONFIG.Canvas.dispositionColors.NEUTRAL
}