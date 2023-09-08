export const MODULE_ID = 'mini-tracker'

export function getSetting(key) {
    return game.settings.get(MODULE_ID, key)
}

export function setSetting(key, value) {
    return game.settings.set(MODULE_ID, key, value)
}

function getSettingLocalizationPath(...path) {
    return `${MODULE_ID}.settings.${path.join('.')}`
}

export function registerSetting(options) {
    const name = options.name
    options.scope = options.scope ?? 'world'
    options.config = options.config ?? false
    if (options.config) {
        options.name = getSettingLocalizationPath(name, 'name')
        options.hint = getSettingLocalizationPath(name, 'hint')
    }
    if (Array.isArray(options.choices)) {
        options.choices = options.choices.reduce((choices, choice) => {
            choices[choice] = getSettingLocalizationPath(name, 'choices', choice)
            return choices
        }, {})
    }
    game.settings.register(MODULE_ID, name, options)
}

export function localize(...args) {
    let [key, data] = args
    key = `${MODULE_ID}.${key}`
    if (data) return game.i18n.format(key, data)
    return game.i18n.localize(key)
}

export function getFlag(doc, key, fallback) {
    return doc.getFlag(MODULE_ID, key) ?? fallback
}

export function setFlag(doc, key, value) {
    return doc.setFlag(MODULE_ID, key, value)
}

function notify(str, arg1, arg2, arg3) {
    const type = typeof arg1 === 'string' ? arg1 : 'info'
    const data = typeof arg1 === 'object' ? arg1 : typeof arg2 === 'object' ? arg2 : undefined
    const permanent = typeof arg1 === 'boolean' ? arg1 : typeof arg2 === 'boolean' ? arg2 : arg3 ?? false

    ui.notifications.notify(localize(str, data), type, { permanent })
}

export function warn(...args) {
    const [str, arg1, arg2] = args
    notify(str, 'warning', arg1, arg2)
}

export function info(...args) {
    const [str, arg1, arg2] = args
    notify(str, 'info', arg1, arg2)
}

export function error(...args) {
    const [str, arg1, arg2] = args
    notify(str, 'error', arg1, arg2)
}

export function templatePath(...path) {
    path = path.filter(x => typeof x === 'string')
    return `modules/${MODULE_ID}/templates/${path.join('/')}`
}

export function getCombatTrackerConfig() {
    return game.settings.get('core', 'combatTrackerConfig')
}

export function easeInQuad(x) {
    return x * x
}

export function flagsUpdatePath(...path) {
    return `flags.${MODULE_ID}.${path.join('/')}`
}

export function getSameCombatants(combatant) {
    return combatant.combat.turns.filter(x => x.actorId === combatant.actorId)
}
