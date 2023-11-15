export function getDnd5eHealthEstimate(actor) {
    const hp = actor.system.attributes.hp
    return {
        hpValue: hp.value + (hp.temp ?? 0),
        hpMax: hp.max + (hp.tempmax ?? 0),
        hpTooltip: hp.temp ? `${hp.value} + ${hp.temp} temp` : '',
    }
}
