export function tokenSetsNameVisibility() {
    if (game.system.id !== 'pf2e') return false
    if (game.settings.settings.has('pf2e.metagame.tokenSetsNameVisibility'))
        return !!game.settings.get('pf2e', 'metagame.tokenSetsNameVisibility')
    return !!game.settings.get('pf2e', 'metagame_tokenSetsNameVisibility')
}
