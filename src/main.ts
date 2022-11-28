import { getSetting, registerSetting } from './@utils/foundry/settings'
import { MiniTracker } from './apps/tracker'
import { thirdPartyInitialization } from './third'
import { preUpdateToken } from './token'

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
    })

    registerSetting({
        name: 'hp',
        config: true,
        type: String,
        default: 'attributes.hp.value',
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
    if (getSetting('enabled')) createTracker()
    if (getSetting('immobilize')) immobilizeHooks(true)
})

function immobilizeHooks(immobilize: unknown) {
    if (!game.user.isGM) {
        const method = immobilize ? 'on' : 'off'
        Hooks[method]('preUpdateToken', preUpdateToken)
    } else {
        tracker?.render()
    }
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
