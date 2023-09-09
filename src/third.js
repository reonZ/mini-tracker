import { tokenSetsNameVisibility } from './third/pf2e'

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
    }
}
