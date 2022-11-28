# FoundryVTT Mini Tracker

This module adds an extra floating `Combat Tracker` which provides new functionalities.

-   [Displayed when needed](#displayed-when-needed)
-   [Minimized](#minimized)
-   [Expanded](#expanded)
-   [Change Orientation](#change-orientation)
-   [Saved](#saved)
-   [Change initiative by dragging combatant](#change-initiative-by-dragging-combatant)
-   [Hide creatures name](#hide-creatures-name)
    -   [Systems](#systems)
    -   [Modules](#modules)
-   [Settings](#settings)
    -   [Enabled (client)](#enabled-client)
    -   [Hover Delay (client)](#hover-delay-client)
    -   [Allow End Turn](#allow-end-turn)
    -   [Pan to Token](#pan-to-token)
    -   [Select Token](#select-token)
    -   [Open Sheet](#open-sheet)

# Displayed when needed

The tracker will automatically appear on screen when there is an active encounter containing a combatant owned by the user (any combatant will do for the GM).

The tracker will be removed when those conditions are not met anymore.

# Minimized

![](./readme/minimized.webp)

The tracker is by default minimized to only display the current combatant, this allow for a very discreet tracker that can be placed in a corner of the screen.

While minimized, the user can mouse over the combatant to expand the tracker temporarily, the delay before expansion can be set (default 250ms).

# Expanded

![](./readme/tracker.webp)

The tracker can be expanded to a regular size either by hovering over the tracker or by clicking <img src="./readme/expand.webp" width="24">

In that state, the tracker will reproduce the behavior of the normal combat tracker with the same features and color coding.

While expanded, you can reduce its size by dragging the extremity of the tracker (opposite to the header).

# Change Orientation

![](./readme/reversed.webp)

The user can change the expanded orientation of the tracker by clicking <img src="./readme/orientation.webp" width="24">

This will reverse the tracker's window and make it expand upward instead of downward, this is useful if the user wants the tracker to be anchored at the bottom of the screen.

# Saved

Position, orientation, minimized/expanded and size limite of the tracker are all saved on the user's browser between sessions.

# Change initiative by dragging combatant

The tracker allow the GM to reorganize and change the initiative of a combatant simply by dragging them inside the tracker: Click and hold the left-click for a short time and start dragging a combatant to another position.

This will set a new initiative for the combatant, using decimals when needed (which may or may not be shown in the tracker depending on the system).

# Prevent Movement

If enabled, this module can prevent players from being able to move tokens on the board.

Combatant tokens will by default be prevented from moving when out of turn. A new ![](./readme//immobilize.webp) icon is added to allow the GM to "free" a combatant token until the end of the current turn.

# Hide creatures name

If a recognized module/system allowing hidding creatures names is found, the name of the creatures will be hidden from the players when appropriate.

It will also add a new <img src="./readme/toggle.webp"> icon to show the GM the current state, also allowing its toggle if possible.

## Systems

-   [Pathfinder Second Edition (Official)](https://foundryvtt.com/packages/pf2e)

## Modules

-   [Anonymous](https://foundryvtt.com/packages/anonymous)

# Settings

## Enabled (client)

Enable or disable the mini tracker for the user.

## Hover Delay (client)

Set the amount of time (in milliseconds) before the tracker starts expands on mouse hover.

## End Turn

Should the players be able to end their own turn.

## Target Token

Allow players to target a token from the tracker, this can be extra useful for systems that hide tokens but still display combatants in the tracker.

## System HP Path

If set with an actor system path, will display the current hp of combatants in the tracker. This option is only for the GM.

## Prevent Movement

When enabled, players will only be able to move their token during their turn. Or when the GM allows it.

## Pan to Token

Should the camera pan to the token of the current combatant. This option is only for the GM.

## Select Token

Should the token of the current combatant be automatically selected. This option is only for the GM.

## Open Sheet

Should the sheet of the current combatant be automatically opened. This option is only for the GM.
