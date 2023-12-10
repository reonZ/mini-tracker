import { getDnd5eHealthEstimate } from './third/dnd5e'
import { getPF2eHealthEstimate, tokenSetsNameVisibility } from './third/pf2e'

export let thirdPartyCanNamesBeHidden
export let thirdPartyPlayersSeeName
export let thirdPartyToggleSeeName
export let thirdPartyGetName

export function thirdPartyInitialization() {
    const anonymous = game.modules.get('anonymous')
    if (anonymous?.active) {
        const api = anonymous.api
        thirdPartyCanNamesBeHidden = () => true
        thirdPartyPlayersSeeName = api.playersSeeName
        thirdPartyToggleSeeName = api.toggleSeeName
        thirdPartyGetName = api.getName
    } else if (game.system.id === 'pf2e') {
        thirdPartyCanNamesBeHidden = tokenSetsNameVisibility
        thirdPartyPlayersSeeName = combatant => combatant.playersCanSeeName
        thirdPartyToggleSeeName = combatant => combatant.toggleNameVisibility()
    }
}

export function thirdPartyHealthEstimate() {
    let fn

    if (game.system.id === 'pf2e') {
        fn = getPF2eHealthEstimate
    } else if (game.system.id === 'dnd5e') {
        fn = getDnd5eHealthEstimate
    }

    return fn ? actor => (actor ? fn(actor) : undefined) : undefined
}
