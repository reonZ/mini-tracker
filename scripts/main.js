import { renameCombatants } from './foundry-tracker.js'
import { MiniTracker } from './tracker.js'
import { getSetting, registerSetting } from './utils/foundry.js'
import { socketOn } from './utils/socket.js'

/** @type {MiniTracker | null} */
let tracker = null

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
        name: 'creature',
        type: String,
        config: true,
        default: '',
        onChange: () => {
            tracker?.render()
            renameCombatants()
        },
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
})

Hooks.once('ready', () => {
    if (getSetting('enabled')) createTracker()

    if (game.user.isGM) return

    Hooks.on('renderCombatTracker', renameCombatants)

    socketOn(packet => {
        if (packet.type === 'refresh') {
            tracker?.render()
            renameCombatants()
        }
    })
})

function createTracker() {
    if (tracker) return
    tracker = new MiniTracker()
    tracker.render(true)
}

function closeTracker() {
    if (tracker) tracker.close()
    tracker = null
}
