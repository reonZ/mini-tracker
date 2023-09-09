const SYSTEM_ID = 'pf2e'

export function isPF2eSystem() {
    return game.system.id === SYSTEM_ID
}

export function getPF2eDispositionColor(combatant) {
    const actor = combatant.actor
    if (!actor) return CONFIG.Canvas.dispositionColors.NEUTRAL

    const alliance = actor.alliance

    if (alliance === 'party')
        return actor.hasPlayerOwner ? CONFIG.Canvas.dispositionColors.PARTY : CONFIG.Canvas.dispositionColors.FRIENDLY

    return alliance === 'opposition' ? CONFIG.Canvas.dispositionColors.HOSTILE : CONFIG.Canvas.dispositionColors.NEUTRAL
}

export function tokenSetsNameVisibility() {
    if (game.system.id !== 'pf2e') return false
    if (game.settings.settings.has('pf2e.metagame.tokenSetsNameVisibility'))
        return !!game.settings.get('pf2e', 'metagame.tokenSetsNameVisibility')
    return !!game.settings.get('pf2e', 'metagame_tokenSetsNameVisibility')
}
