export default 'mini-tracker'

export function isSortableActive() {
    return game.modules.get('_sortablejs')?.active
}
