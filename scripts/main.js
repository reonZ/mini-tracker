var $1623e5e7c705b7c7$export$2e2bcd8739ae039 = "mini-tracker";



function $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc(...path) {
    return `${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.settings.${path.join(".")}`;
}
function $ee65ef5b7d5dd2ef$export$79b67f6e2f31449(...path) {
    return `flags.${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.${path.join("/")}`;
}
function $ee65ef5b7d5dd2ef$export$bdd507c72609c24e(...path) {
    return `modules/${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}/templates/${path.join("/")}`;
}


function $b29eb7e0eb12ddbc$export$8206e8d612b3e63(key) {
    return game.settings.get((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), key);
}
function $b29eb7e0eb12ddbc$export$61fd6f1ddd0c20e2(key, value) {
    return game.settings.set((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), key, value);
}
function $b29eb7e0eb12ddbc$export$3bfe3819d89751f0(options) {
    const name = options.name;
    options.scope = options.scope ?? "world";
    options.config = options.config ?? false;
    if (options.config) {
        options.name = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)(name, "name");
        options.hint = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)(name, "hint");
    }
    game.settings.register((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), name, options);
}
function $b29eb7e0eb12ddbc$export$cd2f7161e4d70860(options) {
    const name = options.name;
    options.name = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)("menus", name, "name");
    options.label = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)("menus", name, "label");
    options.hint = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)("menus", name, "hint");
    options.restricted = options.restricted ?? true;
    options.icon = options.icon ?? "fas fa-cogs";
    game.settings.registerMenu((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), name, options);
}
function $b29eb7e0eb12ddbc$export$8cb4a6769fa1780e() {
    return game.settings.get("core", "combatTrackerConfig");
}



function $53cf1f1c9c92715e$export$eb8e976fd8646538(doc) {
    // @ts-ignore
    return !!doc.flags && (0, $1623e5e7c705b7c7$export$2e2bcd8739ae039) in doc.flags;
}
function $53cf1f1c9c92715e$export$a19b74191e00c5e(doc, key, ...keys) {
    keys.unshift(key);
    return doc.getFlag((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), keys.join("."));
}
function $53cf1f1c9c92715e$export$5e165df1e30a1331(doc, key, value) {
    return doc.setFlag((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), key, value);
}






function $889355b5c39241f1$export$b3bd0bc58e36cd63(key, data) {
    key = `${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.${key}`;
    if (data) return game.i18n.format(key, data);
    return game.i18n.localize(key);
}
function $889355b5c39241f1$export$a2435eff6fb7f6c1(subKey) {
    return (key, data)=>$889355b5c39241f1$export$b3bd0bc58e36cd63(`${subKey}.${key}`, data);
}




function $f13521bdeed07ab3$export$90835e7e06f4e75b(id) {
    return game.modules.get(id);
}
function $f13521bdeed07ab3$export$afac0fc6c5fe0d6() {
    return $f13521bdeed07ab3$export$90835e7e06f4e75b((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039));
}
function $f13521bdeed07ab3$export$d60ce5b76fc8cf55(id) {
    return $f13521bdeed07ab3$export$90835e7e06f4e75b(id)?.api;
}


function $10108fa426e02920$export$7916f20e7c73fc4d() {
    if (game.system.id !== "pf2e") return false;
    if (game.settings.settings.has("pf2e.metagame.tokenSetsNameVisibility")) return !!game.settings.get("pf2e", "metagame.tokenSetsNameVisibility");
    return !!game.settings.get("pf2e", "metagame_tokenSetsNameVisibility");
}


let $7dfb009370bda395$export$5042a3656e88d24d;
let $7dfb009370bda395$export$285c0cb5c375b7d4;
let $7dfb009370bda395$export$9bbc5a3a539b2a19;
let $7dfb009370bda395$export$b4561321dc7efd9;
function $7dfb009370bda395$export$3f54c3168907b251() {
    const anonymous = (0, $f13521bdeed07ab3$export$d60ce5b76fc8cf55)("anonymous");
    if (anonymous) {
        $7dfb009370bda395$export$5042a3656e88d24d = ()=>true;
        $7dfb009370bda395$export$285c0cb5c375b7d4 = anonymous.playersSeeName;
        $7dfb009370bda395$export$9bbc5a3a539b2a19 = anonymous.toggleSeeName;
        $7dfb009370bda395$export$b4561321dc7efd9 = anonymous.getName;
    } else if (game.system.id === "pf2e") {
        $7dfb009370bda395$export$5042a3656e88d24d = (0, $10108fa426e02920$export$7916f20e7c73fc4d);
        $7dfb009370bda395$export$285c0cb5c375b7d4 = (combatant)=>combatant.playersCanSeeName;
    }
}


function $cde63defe07c1790$export$63e364ad1cb51f52() {
    return (0, $7dfb009370bda395$export$5042a3656e88d24d)?.() ?? false;
}
function $cde63defe07c1790$export$7fd1aaec5430227(combatant) {
    return combatant.hasPlayerOwner || ((0, $7dfb009370bda395$export$285c0cb5c375b7d4)?.(combatant) ?? true);
}
function $cde63defe07c1790$export$8205bd1e39ea3d14(combatant) {
    return (0, $7dfb009370bda395$export$9bbc5a3a539b2a19)?.(combatant);
}
function $cde63defe07c1790$export$7d9f7e9c1c02b41e(combatant) {
    return (0, $7dfb009370bda395$export$b4561321dc7efd9)?.(combatant) ?? (0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("unknown");
}
function $cde63defe07c1790$export$3304653039f8a03d(combat) {
    const flag = (0, $ee65ef5b7d5dd2ef$export$79b67f6e2f31449)("freed");
    const updates = combat.combatants.map((x)=>({
            _id: x._id,
            [flag]: false
        }));
    combat.updateEmbeddedDocuments("Combatant", updates);
}
function $cde63defe07c1790$export$e257c0cfb0291b6d(combat) {
    if (combat === ui.combat.viewed) $cde63defe07c1790$export$3304653039f8a03d(combat);
}
function $cde63defe07c1790$export$125ec828e2461284(combatant) {
    const immobilized = (0, $53cf1f1c9c92715e$export$a19b74191e00c5e)(combatant, "freed");
    (0, $53cf1f1c9c92715e$export$5e165df1e30a1331)(combatant, "freed", !immobilized);
}




const $8925e622526f4c62$var$MODULE_ID = "monks-tokenbar";
function $8925e622526f4c62$export$9166f1d492e4980c() {
    return (0, $f13521bdeed07ab3$export$90835e7e06f4e75b)($8925e622526f4c62$var$MODULE_ID)?.active;
}
function $8925e622526f4c62$export$7e36d6922fe269d0(list) {
    const ol = ui.combat.element.find("#combat-tracker");
    const combatants = ol.find('.combatant:has([data-control="toggleMovement"])');
    combatants.each(function() {
        const li = $(this);
        const id = li.attr("data-combatant-id");
        const icon = li.find('[data-control="toggleMovement"]');
        const clone = icon.clone(true);
        clone.on("click", ()=>icon.toggleClass("active"));
        icon.on("click", ()=>clone.toggleClass("active"));
        list.find(`[data-combatant-id="${id}"] [data-control="toggleDefeated"]`).before(clone);
    });
}
function $8925e622526f4c62$export$713ee79f92d45175() {
    return $8925e622526f4c62$export$9166f1d492e4980c() && !!game.settings.get($8925e622526f4c62$var$MODULE_ID, "show-on-tracker");
}


class $dda4b68de52b8e2d$export$cd1fcfaee144ed0d extends Application {
    _initialPointer = {
        x: 0,
        y: 0
    };
    constructor(){
        super();
        const { left: left , bottom: bottom , top: top  } = (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("coords");
        if (typeof left === "number") this.position.left = left;
        if (typeof top === "number") this.position.top = top;
        if (typeof bottom === "number") this.position.bottom = bottom;
        const expanded = (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("expanded");
        this._isExpanded = expanded !== "false";
        this._maxHeight = expanded !== "false" && expanded !== "true" ? parseInt(expanded) : undefined;
        this._isReversed = (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("reversed");
        this._dragging = false;
        this._lastCombat = "";
        this._lastCombatant = "";
        this._lastMoveTime = 0;
        this._dragHook = this.#onDrag.bind(this);
        this._dragEndHook = this.#onDragEnd.bind(this);
        this._resizeHook = this.#onResize.bind(this);
        this._resizeEndHook = this.#onResizeEnd.bind(this);
        this._renderHook = Hooks.on("renderCombatTracker", this.#onRender.bind(this));
        this._hoverHook = Hooks.on("hoverToken", this.#onTokenHover.bind(this));
        this._coordsDebounce = debounce(this.#setCoords, 1000);
        this._expandedDebounce = debounce(this.#setExpanded, 1000);
        this._initialPosition = this.position;
    }
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            popOut: false,
            minimizable: false,
            template: (0, $ee65ef5b7d5dd2ef$export$bdd507c72609c24e)("tracker.html")
        };
    }
    get isReversed() {
        return this._isReversed;
    }
    set isReversed(value) {
        this._isReversed = value;
        this.render();
        (0, $b29eb7e0eb12ddbc$export$61fd6f1ddd0c20e2)("reversed", value);
    }
    get isExpanded() {
        return this._isExpanded;
    }
    set isExpanded(value) {
        this._isExpanded = value;
        if (value) this.#expandList();
        else this.#collapseList();
        this.#setExpanded();
    }
    get isDragging() {
        return this._dragging;
    }
    set isDragging(value) {
        this.element.toggleClass("dragging", value);
        this._dragging = value;
    }
    get moveTick() {
        const now = Date.now();
        if (now - this._lastMoveTime < 1000 / 60) return false;
        this._lastMoveTime = now;
        return true;
    }
    get innerElement() {
        return this.element.find(".__inner");
    }
    get combatantElements() {
        return this.element.find(".combatant");
    }
    get listElement() {
        return this.element.find(".__inner > ol");
    }
    get combatantHeight() {
        if (this._combatantHeight) return this._combatantHeight;
        this._combatantHeight = this.combatantElements.filter(".active").outerHeight(true);
        return this._combatantHeight;
    }
    get boxHeight() {
        if (this._boxHeight) return this._boxHeight;
        const height = this.element.outerHeight(true);
        const listHeight = this.listElement.innerHeight();
        this._boxHeight = height - listHeight;
        return this._boxHeight;
    }
    get innerMargins() {
        if (this._innerMargins) return this._innerMargins;
        const inner = this.innerElement;
        this._innerMargins = parseInt(inner.css("margin-top")) + parseInt(inner.css("margin-bottom"));
        return this._innerMargins;
    }
    get minHeight() {
        return this.combatantHeight + this.boxHeight;
    }
    get maxHeight() {
        return this._maxHeight;
    }
    set maxHeight(value) {
        this._maxHeight = value;
        this._expandedDebounce();
    }
    async getData(options) {
        const combat = ui.combat.viewed;
        if (!combat || !combat.turns.some((x)=>x.isOwner)) return {
            hasCombat: false
        };
        const isGM = game.user.isGM;
        const currentCombatant = combat.combatant;
        const hideNames = (0, $cde63defe07c1790$export$63e364ad1cb51f52)();
        const endTurn = (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("turn");
        const immobilize = (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("immobilize") && !(0, $8925e622526f4c62$export$9166f1d492e4980c)();
        const target = !isGM && (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("target");
        const combatants = combat.combatants;
        const showHp = (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("hp");
        const hideDefeated = (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("dead") && (0, $b29eb7e0eb12ddbc$export$8cb4a6769fa1780e)().skipDefeated;
        let active = false;
        let data = await ui.combat.getData();
        data.turns = data.turns.reduce((acc, x)=>{
            const combatant = combatants.get(x.id);
            if (hideDefeated && x.defeated && !combatant.hasPlayerOwner) return acc;
            const turn = x;
            turn.hp = !!showHp && getProperty(combatant, `actor.system.${showHp}`);
            turn.hasPlayerOwner = combatant.hasPlayerOwner;
            turn.playersCanSeeName = (0, $cde63defe07c1790$export$7fd1aaec5430227)(combatant);
            turn.freed = !immobilize || combatant === currentCombatant || !!(0, $53cf1f1c9c92715e$export$a19b74191e00c5e)(combatant, "freed");
            turn.canImmobilize = combatant !== currentCombatant;
            if (hideNames && !turn.playersCanSeeName && !isGM) turn.name = (0, $cde63defe07c1790$export$7d9f7e9c1c02b41e)(combatant);
            if (x.active) active = true;
            acc.push(turn);
            return acc;
        }, []);
        if (!data.turns.some((x)=>x.owner)) return {
            hasCombat: false
        };
        if (!active) {
            const active1 = Math.min(data.turn ?? 0, data.turns.length - 1);
            const combatant = data.turns[active1];
            const css = combatant.css ? combatant.css.split(" ") : [];
            combatant.active = true;
            css.push("active");
            combatant.css = css.join(" ");
        }
        const reversed = this.isReversed;
        const innerCss = [];
        if (this.isExpanded) innerCss.push("expanded");
        if (reversed && !(0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("fake-reversed")) innerCss.push("reversed");
        return {
            ...data,
            canHideNames: hideNames,
            innerCss: innerCss.join(" "),
            allowEndTurn: endTurn,
            isCurrentTurn: !currentCombatant?.isOwner,
            arrow: reversed ? "up" : "down",
            immobilize: immobilize,
            showHp: showHp,
            target: target
        };
    }
    #onRender() {
        this.render();
    }
    async _render(force, options) {
        await super._render(force, options);
        if (game.user.isGM && (0, $8925e622526f4c62$export$713ee79f92d45175)()) (0, $8925e622526f4c62$export$7e36d6922fe269d0)(this.listElement);
        Hooks.callAll("renderMiniTracker", this, this.element);
    }
    render(force, options) {
        const combat = ui.combat.viewed;
        const isGM = game.user.isGM;
        const combatId = combat?.id ?? "";
        const combatant = combat?.combatant;
        const token = combatant?.token;
        if (isGM && this._lastCombat === combatId && combatant && this._lastCombatant !== combatant.id) {
            if (token && (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("pan") && combatant.visible) canvas.animatePan({
                x: token.x,
                y: token.y
            });
            if (combatant && !combatant.hasPlayerOwner) {
                if (token?.object && (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("select")) token.object.control({
                    releaseOthers: true
                });
                const sheet = combatant.actor?.sheet;
                if (sheet && (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("sheet")) sheet.render(true);
            }
        }
        if (isGM && combat && (this._lastCombat !== combatId || combatant && this._lastCombatant !== combatant.id)) (0, $cde63defe07c1790$export$3304653039f8a03d)(combat);
        this._lastCombat = combatId;
        this._lastCombatant = combatant?.id ?? "";
        return super.render(force, options);
    }
    async close(options) {
        const result = await super.close(options);
        Hooks.off("renderCombatTracker", this._renderHook);
        Hooks.off("hoverToken", this._hoverHook);
        Hooks.call(`closeMiniTracker`, this, this.element);
        return result;
    }
    activateListeners(html) {
        const combat = ui.combat.viewed;
        if (!combat || !this.innerElement.length) return;
        const tracker = ui.combat;
        html.find(".draggable").on("mousedown", this.#onDragStart.bind(this));
        html.find(".__resizer").on("mousedown", this.#onResizeStart.bind(this));
        const list = html.find(".__inner > ol");
        list.on("mouseenter", this.#onListHover.bind(this));
        html.on("mouseleave", this.#onListOut.bind(this));
        html.find("[data-control=trackerReverse]").on("click", ()=>this.isReversed = !this.isReversed);
        html.find("[data-control=trackerExpand]").on("click", ()=>this.isExpanded = !this.isExpanded);
        html.find("[data-control=targetCombatant]").on("click", this.#onTarget.bind(this));
        html.find(".combat-control").on("click", tracker._onCombatControl.bind(tracker));
        html.find(".combatant-control").on("click", tracker._onCombatantControl.bind(tracker));
        const combatants = list.find(".combatant");
        combatants.on("mouseenter", tracker._onCombatantHoverIn.bind(tracker));
        combatants.on("mouseleave", tracker._onCombatantHoverOut.bind(tracker));
        if (!game.user.isGM) return;
        this._contextMenu(html);
        this.#makeSortable();
        html.find("[data-control=trackerSettings]").on("click", ()=>new CombatTrackerConfig().render(true));
        if (!(0, $8925e622526f4c62$export$9166f1d492e4980c)()) html.find('[data-control="toggleImmobilized"]').on("click", this.#onToggleImmobilized.bind(this));
        if ((0, $cde63defe07c1790$export$63e364ad1cb51f52)() && (0, $7dfb009370bda395$export$9bbc5a3a539b2a19)) html.find("[data-control=toggle-name-visibility]").on("click", this.#togglePlayersCanSeeName.bind(this));
        combatants.on("click", tracker._onCombatantMouseDown.bind(tracker));
    }
    setPosition({ left: left , top: top , bottom: bottom  }) {
        const el = this.element[0];
        const currentPosition = this.position;
        const minHeight = this.minHeight;
        const height = el.offsetHeight;
        const width = el.offsetWidth;
        const winHeight = window.innerHeight;
        const winWidth = window.innerWidth;
        left = left ?? winWidth / 2 - width / 2;
        top = top ?? winHeight / 2 - height / 2;
        bottom = bottom ?? winHeight / 2 - height / 2;
        const maxLeft = Math.max(winWidth - width, 0);
        currentPosition.left = Math.clamped(left, 0, maxLeft);
        el.style.left = currentPosition.left + "px";
        if (this.isReversed) {
            if (bottom + minHeight > winHeight) bottom = winHeight - minHeight;
            if (bottom < 0) bottom = 0;
            el.style.bottom = bottom + "px";
            currentPosition.bottom = bottom;
            currentPosition.top = winHeight - bottom - minHeight;
        } else {
            if (top + minHeight > winHeight) top = winHeight - minHeight;
            if (top < 0) top = 0;
            el.style.top = top + "px";
            currentPosition.top = top;
            currentPosition.bottom = winHeight - top - minHeight;
        }
        this.#calculateHeight();
        return currentPosition;
    }
    _contextMenu($html) {
        this._menu = ContextMenu.create(this, $html, ".combatant", ui.combat._getEntryContextOptions());
    }
    #getCombatantFromEvent(event) {
        const $combatant = $(event.currentTarget).closest(".combatant");
        const id = $combatant.attr("data-combatant-id");
        return ui.combat.viewed?.combatants.get(id);
    }
    #onTarget(event1) {
        event1.preventDefault();
        const combatant = this.#getCombatantFromEvent(event1);
        const token = combatant?.token;
        if (!token) return;
        const current = Array.from(game.user.targets).map((x)=>x.id);
        const targets = event1.shiftKey ? current : current.filter((x)=>x === token.id);
        const index = targets.indexOf(token.id);
        if (index !== -1) targets.splice(index, 1);
        else targets.push(token.id);
        game.user.updateTokenTargets(targets);
    }
    #onToggleImmobilized(event2) {
        event2.preventDefault();
        const combatant1 = this.#getCombatantFromEvent(event2);
        if (combatant1) (0, $cde63defe07c1790$export$125ec828e2461284)(combatant1);
    }
    async #togglePlayersCanSeeName(event3) {
        event3.preventDefault();
        const combatant2 = this.#getCombatantFromEvent(event3);
        if (combatant2) (0, $cde63defe07c1790$export$8205bd1e39ea3d14)(combatant2);
    }
    #makeSortable() {
        this._sortable = new Sortable(this.listElement[0], {
            animation: 150,
            draggable: ".combatant",
            delay: 50,
            onEnd: this.#onSortEnd.bind(this)
        });
    }
    #onSortEnd(event4) {
        const id1 = event4.item.dataset.combatantId;
        const combat = ui.combat.viewed;
        const oldIndex = /** @type {number} */ event4.oldIndex;
        const newIndex = /** @type {number} */ event4.newIndex;
        if (!combat || oldIndex === newIndex || !id1) return;
        const turns = combat.turns;
        if (turns.length <= 1) return;
        const others = turns.filter((x)=>x.id !== id1);
        const prevCombatants = others.slice(0, newIndex);
        const nextCombatants = others.slice(newIndex);
        let prevInit = prevCombatants.reverse().find((x)=>x.initiative != null)?.initiative;
        let nextInit = nextCombatants.find((x)=>x.initiative != null)?.initiative;
        if (nextInit == null && prevInit == null) {
            nextInit = 0;
            prevInit = 2;
        } else if (nextInit == null) nextInit = /** @type {number} */ prevInit - 2;
        else if (prevInit == null) prevInit = /** @type {number} */ nextInit + 2;
        // @ts-ignore
        const newInit = (prevInit + nextInit) / 2;
        combat.setInitiative(id1, newInit);
    }
    #onResizeStart(event5) {
        event5.preventDefault();
        window.addEventListener("mousemove", this._resizeHook);
        window.addEventListener("mouseup", this._resizeEndHook);
    }
    #onResize(event6) {
        event6.preventDefault();
        if (!this.moveTick) return;
        let maxHeight = event6.clientY - (this.position.top ?? 0);
        if (this.isReversed) maxHeight = -(maxHeight - this.minHeight);
        maxHeight = Math.max(maxHeight, this.minHeight);
        this.#calculateHeight(maxHeight);
        const combatants = this.combatantElements.length;
        const expected = combatants * this.combatantHeight + this.boxHeight;
        if (maxHeight >= expected) maxHeight = undefined;
        this.maxHeight = maxHeight;
    }
    #onResizeEnd(event7) {
        event7.preventDefault();
        window.removeEventListener("mousemove", this._resizeHook);
        window.removeEventListener("mouseup", this._resizeEndHook);
    }
    #onDragStart(event8) {
        event8.preventDefault();
        this.isDragging = true;
        this._initialPosition = duplicate(this.position);
        this._initialPointer = {
            x: event8.clientX,
            y: event8.clientY
        };
        window.addEventListener("mousemove", this._dragHook);
        window.addEventListener("mouseup", this._dragEndHook);
    }
    #onDrag(event9) {
        event9.preventDefault();
        if (!this.moveTick) return;
        const pos = this._initialPosition;
        const cursor = this._initialPointer;
        const left = (pos.left ?? 0) + (event9.clientX - cursor.x);
        if (this.isReversed) this.setPosition({
            left: left,
            bottom: (pos.bottom ?? 0) - (event9.clientY - cursor.y)
        });
        else this.setPosition({
            left: left,
            top: (pos.top ?? 0) + (event9.clientY - cursor.y)
        });
        this._coordsDebounce();
    }
    #onDragEnd(event10) {
        event10.preventDefault();
        this.isDragging = false;
        this.#calculateHeight();
        window.removeEventListener("mousemove", this._dragHook);
        window.removeEventListener("mouseup", this._dragEndHook);
    }
    #onTokenHover(token1, hovered) {
        const combatant3 = token1.combatant;
        if (!combatant3) return;
        const combatants1 = this.combatantElements;
        combatants1.removeClass("hovered");
        if (hovered) combatants1.filter(`[data-combatant-id="${combatant3.id}"]`).addClass("hovered");
    }
    #setExpanded() {
        (0, $b29eb7e0eb12ddbc$export$61fd6f1ddd0c20e2)("expanded", !this.isExpanded ? "false" : this.maxHeight || "true");
    }
    #expandList() {
        this.innerElement.addClass("expanded");
        this.#calculateHeight();
    }
    #collapseList() {
        if (this._listHoverHook) clearTimeout(this._listHoverHook);
        this.innerElement.removeClass("expanded");
        this._menu?.close({
            animate: false
        });
    }
    #onListHover() {
        if (this.isExpanded) return;
        const delay = (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("delay");
        if (delay) this._listHoverHook = setTimeout(()=>this.#expandList(), delay);
        else this.#expandList();
    }
    #onListOut() {
        if (this.isExpanded) return;
        this.#collapseList();
    }
    #calculateHeight(tmpHeight) {
        const inner = this.innerElement;
        if (!inner.length) return;
        const winHeight = window.innerHeight;
        let maxHeight1;
        if (this.isReversed) maxHeight1 = winHeight - (this.position.bottom ?? 0);
        else maxHeight1 = winHeight - (this.position.top ?? 0);
        if (tmpHeight && tmpHeight < maxHeight1) maxHeight1 = tmpHeight;
        else if (this.maxHeight && this.maxHeight < maxHeight1) maxHeight1 = this.maxHeight;
        maxHeight1 = Math.max(maxHeight1, this.minHeight);
        maxHeight1 -= this.innerMargins;
        inner.css("max-height", maxHeight1);
        if (this.isExpanded) this.#scrollToCurrent();
    }
    #scrollToCurrent() {
        const list = this.listElement;
        const height = list.innerHeight();
        if (height === list.prop("scrollHeight")) return;
        const active = list.find("> .active")[0];
        list.scrollTop(active.offsetTop - height / 2 + active.offsetHeight / 2);
    }
    #setCoords() {
        const { left: left1 , top: top , bottom: bottom  } = this.position;
        (0, $b29eb7e0eb12ddbc$export$61fd6f1ddd0c20e2)("coords", {
            left: left1,
            top: top,
            bottom: bottom
        });
    }
}




function $c04235eee8e32194$export$6ab464d7cd6b504d(config, html) {
    $c04235eee8e32194$var$injectHTML(html);
    $c04235eee8e32194$var$addEvents(html);
    html.css("height", "auto");
}
function $c04235eee8e32194$var$addEvents(html) {
    html.find('input[name="hideDeads"]').on("change", function() {
        const checked = $(this).is(":checked");
        (0, $b29eb7e0eb12ddbc$export$61fd6f1ddd0c20e2)("dead", checked);
    });
}
function $c04235eee8e32194$var$injectHTML(html) {
    const checked = (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("dead") ? "checked" : "";
    let content = '<div class="form-group">';
    content += `<label>${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("settings.dead.name")}</label>`;
    content += `<input type="checkbox" name="hideDeads" ${checked}>`;
    content += `<p class="notes">${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("settings.dead.hint")}</p>`;
    content += "</div>";
    html.find(".form-group").last().after(content);
}






function $d20bc07084c62caf$export$5e14cdade93d6f7b(str, arg1, arg2, arg3) {
    const type = typeof arg1 === "string" ? arg1 : "info";
    const data = typeof arg1 === "object" ? arg1 : typeof arg2 === "object" ? arg2 : undefined;
    const permanent = typeof arg1 === "boolean" ? arg1 : typeof arg2 === "boolean" ? arg2 : arg3 ?? false;
    ui.notifications.notify((0, $889355b5c39241f1$export$b3bd0bc58e36cd63)(str, data), type, {
        permanent: permanent
    });
}
function $d20bc07084c62caf$export$c106dd0671a0fc2d(str, arg1, arg2) {
    $d20bc07084c62caf$export$5e14cdade93d6f7b(str, "warning", arg1, arg2);
}
function $d20bc07084c62caf$export$a80b3bd66acc52ff(str, arg1, arg2) {
    $d20bc07084c62caf$export$5e14cdade93d6f7b(str, "info", arg1, arg2);
}
function $d20bc07084c62caf$export$a3bc9b8ed74fc(str, arg1, arg2) {
    $d20bc07084c62caf$export$5e14cdade93d6f7b(str, "error", arg1, arg2);
}



function $66d137fe0087513e$export$9e2622decb731a81(token, data) {
    if (!(0, $b013a5dd6d18443e$export$1bb3d147765683cf) || !("x" in data || "y" in data)) return;
    const combatant = token.combatant;
    const combat = ui.combat.viewed;
    if (!combat || !combatant || combat.combatant === combatant || (0, $53cf1f1c9c92715e$export$a19b74191e00c5e)(combatant, "freed")) return;
    delete data.x;
    delete data.y;
    (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("immobilized");
}


let $b013a5dd6d18443e$export$1bb3d147765683cf = null;
Hooks.once("init", ()=>{
    // CLIENT SETTINGS
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "enabled",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: (enabled)=>{
            if (enabled) $b013a5dd6d18443e$var$createTracker();
            else $b013a5dd6d18443e$var$closeTracker();
        }
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "delay",
        scope: "client",
        config: true,
        type: Number,
        default: 250
    });
    // CLIENT HIDDEN SETTINGS
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "reversed",
        scope: "client",
        type: Boolean,
        default: false
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "fake-reversed",
        scope: "client",
        type: Boolean,
        default: false,
        onChange: $b013a5dd6d18443e$var$refreshTracker
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "coords",
        scope: "client",
        type: Object,
        default: {}
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "expanded",
        scope: "client",
        type: String,
        default: "false"
    });
    // WORLD SETTINGS
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "turn",
        config: true,
        type: Boolean,
        default: false
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "target",
        config: true,
        type: Boolean,
        default: true
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "hp",
        config: true,
        type: String,
        default: "attributes.hp.value",
        onChange: $b013a5dd6d18443e$var$hpHooks
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "dead",
        config: true,
        type: Boolean,
        default: false,
        onChange: $b013a5dd6d18443e$var$refreshTracker
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "immobilize",
        config: true,
        type: Boolean,
        default: false,
        onChange: $b013a5dd6d18443e$var$immobilizeHooks
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "pan",
        config: true,
        type: Boolean,
        default: true
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "select",
        config: true,
        type: Boolean,
        default: true
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "sheet",
        config: true,
        type: Boolean,
        default: false
    });
    (0, $7dfb009370bda395$export$3f54c3168907b251)();
});
Hooks.once("ready", ()=>{
    if ((0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("enabled")) $b013a5dd6d18443e$var$createTracker();
    if ((0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("immobilize")) $b013a5dd6d18443e$var$immobilizeHooks(true);
    if ((0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("hp")) $b013a5dd6d18443e$var$hpHooks(true);
});
Hooks.on("renderCombatTrackerConfig", (0, $c04235eee8e32194$export$6ab464d7cd6b504d));
function $b013a5dd6d18443e$var$refreshTracker() {
    $b013a5dd6d18443e$export$1bb3d147765683cf?.render();
}
function $b013a5dd6d18443e$var$hpHooks(show) {
    if (!game.user.isGM) return;
    const method = show ? "on" : "off";
    Hooks[method]("updateActor", $b013a5dd6d18443e$var$updateActor);
    $b013a5dd6d18443e$var$refreshTracker();
}
function $b013a5dd6d18443e$var$updateActor(actor, data) {
    const hasHp = hasProperty(data, "system.attributes.hp.value");
    if (hasHp) $b013a5dd6d18443e$var$refreshTracker();
}
function $b013a5dd6d18443e$var$immobilizeHooks(immobilize) {
    if ((0, $8925e622526f4c62$export$9166f1d492e4980c)()) return;
    if (!game.user.isGM) {
        const method = immobilize ? "on" : "off";
        Hooks[method]("preUpdateToken", (0, $66d137fe0087513e$export$9e2622decb731a81));
    } else $b013a5dd6d18443e$var$refreshTracker();
}
function $b013a5dd6d18443e$var$createTracker() {
    if ($b013a5dd6d18443e$export$1bb3d147765683cf) return;
    $b013a5dd6d18443e$export$1bb3d147765683cf = new (0, $dda4b68de52b8e2d$export$cd1fcfaee144ed0d)();
    $b013a5dd6d18443e$export$1bb3d147765683cf.render(true);
}
function $b013a5dd6d18443e$var$closeTracker() {
    if ($b013a5dd6d18443e$export$1bb3d147765683cf) $b013a5dd6d18443e$export$1bb3d147765683cf.close();
    $b013a5dd6d18443e$export$1bb3d147765683cf = null;
}


export {$b013a5dd6d18443e$export$1bb3d147765683cf as tracker};
//# sourceMappingURL=main.js.map
