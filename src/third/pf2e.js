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

export function getPF2eHealthEstimate(actor) {
    const hp = actor.system.attributes.hp

    let hpValue = hp.value + hp.temp
    let hpMax = hp.max
    let hasSpecial = !!hp.temp
    let tooltip = hp.value

    if (hasSpecial) tooltip += ` + ${hp.temp} temp`

    if (actor.type === 'character' && game.settings.get('pf2e', 'staminaVariant')) {
        hpValue += hp.sp.value
        hpMax += hp.sp.max
        hasSpecial ||= !!hp.sp.value
        tooltip += ` + ${hp.sp.value} stam`
    }

    return {
        hpValue,
        hpMax,
        hpTooltip: hasSpecial ? tooltip : '',
    }
}
