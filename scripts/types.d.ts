declare namespace Application {
    interface Position {
        bottom?: number
    }
}

declare interface TrackerCoords {
    left?: number
    top?: number
    bottom?: number
}

declare interface CombatTrackerTemplateDataTurn {
    hasPlayerOwner: boolean
    playersCanSeeName: boolean
}
