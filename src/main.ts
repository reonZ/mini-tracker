import { MiniTracker } from '@apps/tracker'
import { thirdPartyInitialization } from '@utils/anonymous/third'
import { error } from '@utils/foundry/notification'
import { getSetting, registerSetting } from '@utils/foundry/settings'
import { setModuleID } from '@utils/module'
import { hasMTB } from './thirds/mtb'
import { preUpdateToken } from './token'
import { renderCombatTrackerConfig } from './tracker'

export const MODULE_ID = 'mini-tracker'
setModuleID(MODULE_ID)

export let tracker: MiniTracker | null = null

Hooks.once('init', () => {
    // CLIENT SETTINGS

    registerSetting({
        name: 'enabled',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: enabled => {
            if (enabled) createTracker()
            else closeTracker()
        },
    })

    registerSetting({
        name: 'scale',
        scope: 'client',
        config: true,
        type: Number,
        default: 14,
        range: {
            min: 10,
            max: 30,
            step: 1,
        },
        onChange: refreshTracker,
    })

    registerSetting({
        name: 'hover',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
    })

    registerSetting({
        name: 'delay',
        scope: 'client',
        config: true,
        type: Number,
        default: 250,
    })

    // CLIENT HIDDEN SETTINGS

    registerSetting({
        name: 'reversed',
        scope: 'client',
        type: Boolean,
        default: false,
    })

    registerSetting({
        name: 'fake-reversed',
        scope: 'client',
        type: Boolean,
        default: false,
        onChange: refreshTracker,
    })

    registerSetting({
        name: 'coords',
        scope: 'client',
        type: Object,
        default: {},
    })

    registerSetting({
        name: 'expanded',
        scope: 'client',
        type: String,
        default: 'false',
    })

    // WORLD SETTINGS

    registerSetting({
        name: 'turn',
        config: true,
        type: Boolean,
        default: false,
        onChange: refreshTracker,
    })

    registerSetting({
        name: 'showHp',
        config: true,
        type: String,
        default: 'friendly',
        choices: ['none', 'gm', 'friendly', 'all'],
        onChange: hpHooks,
    })

    registerSetting({
        name: 'hpValue',
        config: true,
        type: String,
        default: 'attributes.hp.value',
        onChange: refreshTracker,
    })

    registerSetting({
        name: 'hpMax',
        config: true,
        type: String,
        default: 'attributes.hp.max',
        onChange: refreshTracker,
    })

    registerSetting({
        name: 'dim',
        config: true,
        type: Boolean,
        default: false,
        onChange: refreshTracker,
    })

    registerSetting({
        name: 'dead',
        config: true,
        type: Boolean,
        default: false,
        onChange: refreshTracker,
    })

    registerSetting({
        name: 'hide',
        config: true,
        type: Boolean,
        default: false,
    })

    registerSetting({
        name: 'reveal',
        config: true,
        type: Boolean,
        default: false,
    })

    registerSetting({
        name: 'revealToken',
        config: true,
        type: Boolean,
        default: true,
    })

    registerSetting({
        name: 'immobilize',
        config: true,
        type: Boolean,
        default: false,
        onChange: immobilizeHooks,
    })

    registerSetting({
        name: 'pan',
        config: true,
        type: Boolean,
        default: true,
    })

    registerSetting({
        name: 'select',
        config: true,
        type: Boolean,
        default: true,
    })

    registerSetting({
        name: 'sheet',
        config: true,
        type: Boolean,
        default: false,
    })

    thirdPartyInitialization()
})

Hooks.once('ready', () => {
    if (game.user.isGM) checkForSortable()

    if (getSetting('enabled')) createTracker()
    if (getSetting('immobilize')) immobilizeHooks(true)
    if (getSetting('hpValue')) hpHooks(true)
})

Hooks.on('renderCombatTrackerConfig', renderCombatTrackerConfig)

function hpHooks(show: unknown) {
    const method = show ? 'on' : 'off'
    Hooks[method]('updateActor', updateActor)
    refreshTracker()
}

function updateActor(actor: Actor, data: DocumentUpdateData<Actor>) {
    const hpValue = getSetting<string>('hpValue')
    const hpMax = getSetting<string>('hpMax')
    if (hpValue !== undefined && hasProperty(data, `system.${hpValue}`)) return refreshTracker()
    if (hpMax !== undefined && hasProperty(data, `system.${hpMax}`)) return refreshTracker()
}

function immobilizeHooks(immobilize: unknown) {
    if (hasMTB()) return
    if (!game.user.isGM) {
        const method = immobilize ? 'on' : 'off'
        Hooks.on('preUpdateToken', preUpdateToken)
    } else {
        refreshTracker()
    }
}

function checkForSortable() {
    if (game.modules.get('_sortablejs')?.active) return
    error('sortable', true)
}

function refreshTracker() {
    tracker?.render()
}

function createTracker() {
    if (tracker) return
    tracker = new MiniTracker()
    tracker.render(true)
}

function closeTracker() {
    if (tracker) tracker.close()
    tracker = null
}
