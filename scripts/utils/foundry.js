import MODULE_ID from './module.js'

/** @param {...string} path */
export function templatePath(...path) {
    return `modules/${MODULE_ID}/templates/${path.join('/')}`
}

/** @param {string[]} path */
function getSettingLocalizationPath(...path) {
    return `${MODULE_ID}.settings.${path.join('.')}`
}

/**
 * @template {*} T
 * @param {Omit<RequiredBy<SettingConfig<T>, 'name'>, 'key' | 'namespace'>} options
 * options.scope = 'world'
 *
 * options.config = false
 */
export function registerSetting(options) {
    const name = options.name
    options.scope = options.scope ?? 'world'
    options.config = options.config ?? false
    if (options.config) {
        options.name = getSettingLocalizationPath(name, 'name')
        options.hint = getSettingLocalizationPath(name, 'hint')
    }
    game.settings.register(MODULE_ID, name, options)
}

/**@param {string} key*/
export function getSetting(key) {
    return game.settings.get(MODULE_ID, key)
}

/**
 * @template T
 * @param {string} key
 * @param {T} value
 */
export function setSetting(key, value) {
    return game.settings.set(MODULE_ID, key, value)
}

/**
 * @param {foundry.Document} document
 * @param {string} key
 */
export function getFlag(document, key) {
    return document.getFlag(MODULE_ID, key)
}

/**
 * @param {foundry.Document} document
 * @param {string} key
 * @param {*} value
 * @returns {Promise<foundry.Document>}
 */
export function setFlag(document, key, value) {
    return document.setFlag(MODULE_ID, key, value)
}

/**
 * @param {Combatant} combatant
 * @param {string} key
 */
export function getCombatantFlag(combatant, key) {
    return getFlag(combatant.token ?? combatant, key)
}

/**
 * @param {Combatant} combatant
 * @param {string} key
 * @param {*} value
 */
export function setCombatantFlag(combatant, key, value) {
    return setFlag(combatant.token ?? combatant, key, value)
}
