import { getModuleApi } from './@utils/foundry/module'
import { tokenSetsNameVisibility } from './thirds/dnd5'

export let thirdPartyCanNamesBeHidden: () => boolean
export let thirdPartyPlayersSeeName: ((combatant: Combatant) => boolean) | undefined
export let thirdPartyToggleSeeName: ((combatant: Combatant) => Promise<unknown>) | undefined
export let thirdPartyGetName: ((combatant: Combatant) => string) | undefined

export function thirdPartyInitialization() {
    const anonymous = getModuleApi('anonymous')
    if (anonymous) {
        thirdPartyCanNamesBeHidden = () => true
        thirdPartyPlayersSeeName = anonymous.playersSeeName
        thirdPartyToggleSeeName = anonymous.toggleSeeName
        thirdPartyGetName = anonymous.getName
    } else if (game.system.id === 'pf2e') {
        thirdPartyCanNamesBeHidden = tokenSetsNameVisibility
        thirdPartyPlayersSeeName = combatant => (combatant as CombatantPF2e).playersCanSeeName
    }
}
