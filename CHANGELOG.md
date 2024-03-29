# 1.22.0

-   added a new `Texture Scaling` client setting (default enabled): the module will invert scale the combatant's image based on the token texture scaling, useful for worlds that use popout images

# 1.21.1

-   fixed error with missing handlebar helper

# 1.21.0

-   added a `Threat Award` tooltip for the `PF2e` system, it can be seen when hovering over the setting cog icon
-   fixed not being able to toggle name visibility when using the `PF2e` system `Tokens Determine NPC Name Visibility` metagame setting

# 1.20.1

-   changed the `Ping Token` icon

# 1.20.0

-   added special health estimate for both the `DnD5e` and `PF2e` systems
    -   it will now show the total of the HP + temp HP + stamina (for `PF2e`)
    -   if the combatant has any temp HP or stamina, the little heart will have a blue shadow and hovering over it will show the separated values

# 1.19.3

-   fixed immobilization error for players

# 1.19.2

-   fixed third party toggle see name error

# 1.19.1

-   fixed error with the `pf2e` system
-   fixed sheet not automatically closing when it was in the `RENDERING` state

# 1.19.0

-   you can now directly go to any combatant initiative using `ctrl + click` which prevent the need to click multiple times on `Next Turn` or `Previous Turn` to reach the combatant (also preventing turn change triggers from certain systems/modules for the in-between combatants)
-   added `Close Sheet` setting, when enabled, the actor sheet of the last combatant will be automatically closed (this is a GM only setting)
-   added `Save Sheet Coords` setting, when enabled, the coordinates of the last automatically closed sheet will be saved and used for subsequent automatically opened sheets

# 1.18.0

-   added `Only When Started` setting, when enabled the tracker will only show up for players if the combat has actually started

# 1.17.1

-   replaced root-level url to use relative path

# 1.17.0

-   this update is only for v11
-   updated effect statuses for v11 (removes warnings spam)
-   the module now ships `SortableJS` directly and therefore doesn't have the module dependency

# 1.16.0

-   just a manifest update for v11, no work was actually done for it

# 1.15.0

-   added the target icon to the GM (previously only players had access to it)
-   the target icon is now a toggleable (it will be active when the combatant is one of the user's target)
-   now uses the token disposition color scheme for combatant border and background (inspired by the `pf2e` system)

# 1.14.0

-   the mini tracker application now properly emit hooks (no more name scrambling)
-   now display <u>player</u> targets color stickers (same shape and color as default foundry)
-   font size of the tracker should be an even number (setting range input will move by steps of 2)

# 1.13.2

-   will now check if the `SortableJS` module is active and display an error to the GM if not.

# 1.13.1

-   fix a bug with `pf2e` lootable combatant permission

# 1.13.0

-   added `Font Size` setting, the entire tracker will scale with it

# 1.12.0

-   added `Hide Combatants` setting to automatically hide newly created combatants in the tracker
-   added `Reveal Combatants` setting to automatically reveal hidden combatants when their turn comes
-   added `Reveal Tokens` setting to also reveal the combatant token

# 1.11.0

-   holding `shift` while toggling a name will toggle the names of all the combatants with the same actor

# 1.10.2

-   spanish localization updated thanks to [lozanoje](https://github.com/lozanoje)

# 1.10.1

-   cleaned up old application prefix (tracker id is now just `mini-tracker`)
-   fixed bug showing invisible combatants to players
-   fixed a bug for effects without ID
-   pushed foundry version minimum to `10.291`

# 1.10.0

-   refactor of combat data gathering, allows for easier implementation of features
-   always show the initiative icon if hp is supposed to be shown
-   reorganized color priorities for the initiative block
-   added a `Show HP` setting to select the requirement to display HP in the tracker
-   remove the `Target Token` setting, it is always available
-   fixed players end turn
-   added tooltips to all control icons
-   added tooltips to effects icons when possible
-   now uses an ease-in-quad to calculate the color of the hp instead of a linear progression

# 1.9.0

-   added a setting for `HP Max Path` to color code the displayed hp depending on ratio current/max hp
-   players will now see the hp of other player-owned combatants
-   fixed an issue with the dim color spilling over the initiative block
-   fixed an issue with actor update checking

# 1.8.5

-   added a setting to allow the tracker to expand on hover

# 1.8.4

-   added a setting to dim out anonymous names on the GM client

# 1.8.3

-   fixed a mistake that prevented the anonymous icon to be displayed

# 1.8.2

-   `Hide Defeated?` is now a world setting

# 1.8.1

-   fixed a "crash" when the tracker was empty due to no visible combatant

# 1.8.0

-   Added the option to hide defeated NPCs
-   fixed `Monk's TokenBar` module check

# 1.7.0

-   added Spanish localization thanks to [lozanoje](https://github.com/lozanoje)

# 1.6.6

-   if the module `Monk's TokenBar` is present, its movement restriction system will be used instead and the icon on the mini tracker will toggle it

# 1.6.5

-   fixed a issue with the initiative block layout

# 1.6.4

-   the tracker now collapses only when the mouse leaves its outer box instead of the inner combatant list
-   the module emits custom application render and close hooks to comply with how the foundry normally function

# 1.6.3

-   now display a single arrow showing the orientation of the tracker
-   a hidden setting has been added to allow the tracker to be expanded upward without changing its UI

# 1.6.2

-   cleaned some debug stuff

# 1.6.1

-   only show the HP element when appropriate

# 1.6.0

-   added a setting to allow players to end their own turn
-   added a setting to display the HP of the combatants for the GM
-   added a setting to prevent combatant's token to move out of turn
-   added a setting to allow players to target combatnt's token from the tracker
-   project switched to typescript

# 1.0.2

-   make sure the right PF2e metagame setting is returned

# 1.0.1

-   updated to use the new PF2e `metagame_tokenSetsNameVisibility` setting

# 1.0.0

-   original release
