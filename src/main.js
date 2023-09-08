import { updateActor } from './actor'
import { MiniTracker } from './apps/tracker'
import { getSetting, registerSetting } from './module'
import { thirdPartyInitialization } from './third'
import { hasMTB } from './third/mtb'
import { renderCombatTrackerConfig } from './tracker'

export let tracker = null

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
            step: 2,
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
        name: 'started',
        config: true,
        type: Boolean,
        default: false,
        onChange: refreshTracker,
    })

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

    registerSetting({
        name: 'close-sheet',
        config: true,
        type: Boolean,
        default: false,
    })

    registerSetting({
        name: 'sheet-coords',
        config: true,
        type: Boolean,
        default: true,
    })

    thirdPartyInitialization()
})

Hooks.once('ready', () => {
    setTimeout(() => {
        if (getSetting('enabled')) createTracker()
        if (getSetting('immobilize')) immobilizeHooks(true)
        if (getSetting('hpValue')) hpHooks(true)
    }, 1000)
})

Hooks.on('renderCombatTrackerConfig', renderCombatTrackerConfig)

function hpHooks(show) {
    const method = show ? 'on' : 'off'
    Hooks[method]('updateActor', updateActor)
    refreshTracker()
}

function immobilizeHooks(immobilize) {
    if (hasMTB()) return

    if (!game.user.isGM) {
        const method = immobilize ? 'on' : 'off'
        Hooks[method]('preUpdateToken', preUpdateToken)
    } else {
        refreshTracker()
    }
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
    tracker?.close()
    tracker = null
}
