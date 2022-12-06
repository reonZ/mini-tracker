declare interface TrackerCoords {
    left?: number
    top?: number
    bottom?: number
}

declare interface CombatTrackerTemplateDataTurn {
    hasPlayerOwner: boolean
    playersCanSeeName: boolean
}

interface ApplicationPosition {
    bottom?: number
}

interface Turn {
    id: string
    css: string
    name: string
    img: string
    hidden: boolean
    hasPlayerOwner: boolean
    playersCanSeeName: boolean
    freed: boolean
    canImmobilize: boolean
    defeated: boolean
    canPing: boolean
    effects: Array<{ icon: string; name: string }>
    hasRolled: boolean
    initiative: number | null
    owner: boolean
    hpValue?: number
    hpMax?: number
    hpHue?: number

    active: boolean
}
