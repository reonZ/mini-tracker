import { tracker } from './main'
import { getFlag, warn } from './module'

export function preUpdateToken(token, data) {
    if (!tracker || !('x' in data || 'y' in data)) return

    const combatant = token.combatant
    const combat = ui.combat.viewed
    if (!combat || !combatant || combat.combatant === combatant || getFlag(combatant, 'freed')) return

    delete data.x
    delete data.y

    warn('immobilized')
}
