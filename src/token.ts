import { warn } from '@utils/foundry/notification'
import { getFlag } from '@utils/foundry/flags'
import { tracker } from './main'

export function preUpdateToken(token: TokenDocument, data: Partial<foundry.data.TokenSource>) {
    if (!tracker || !('x' in data || 'y' in data)) return

    const combatant = token.combatant
    const combat = ui.combat.viewed
    if (!combat || !combatant || combat.combatant === combatant || getFlag(combatant, 'freed')) return

    delete data.x
    delete data.y

    warn('immobilized')
}
