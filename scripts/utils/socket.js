import MODULE_ID from './module.js'

/** @typedef {{type: string, value?: any}} SocketArgs */

/** @param {(packet: SocketArgs) => void} callback */
export function socketOn(callback) {
    game.socket.on(`module.${MODULE_ID}`, callback)
}

/** @param {SocketArgs} packet */
export function socketEmit(packet) {
    game.socket.emit(`module.${MODULE_ID}`, packet)
}
