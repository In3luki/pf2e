import { AbilityTrait, ActionCategory } from "@item/ability/index.ts";
import { ActionType, ItemType } from "@item/base/data/index.ts";
import { PHYSICAL_ITEM_TYPES } from "@item/physical/values.ts";
import { BaseSpellcastingEntry } from "@item/spellcasting-entry/index.ts";
import { SvelteApplicationMixin } from "@module/sheet/mixin.svelte.ts";
import { ErrorPF2e, setHasElement } from "@util";
import * as R from "remeda";
import { untrack } from "svelte";
import type {
    ApplicationConfiguration,
    ApplicationHeaderControlsEntry,
    ApplicationRenderOptions,
} from "types/foundry/client-esm/applications/_types.ts";
import App from "./components/app.svelte";
import { BrowserTab, BrowserTabs, ContentTabName, PackInfo, SourceInfo, TabData, TabName } from "./data.ts";
import { PackLoader } from "./loader.ts";
import { CompendiumBrowserSettingsApp } from "./settings.ts";
import { BrowserFilter, CompendiumBrowserIndexData } from "./tabs/data.ts";
import * as browserTabs from "./tabs/index.ts";

const foundryApp = foundry.applications.api;

class CompendiumBrowser extends SvelteApplicationMixin(foundryApp.ApplicationV2) {
    settings: CompendiumBrowserSettings;
    dataTabsList = ["action", "bestiary", "campaignFeature", "equipment", "feat", "hazard", "spell"] as const;
    tabs: BrowserTabs;
    tabsArray: BrowserTab[];
    packLoader = new PackLoader();
    root = App;

    /** The amount of rendered result items for initial loading and per load operation */
    static RESULT_LIMIT = 100;

    activeTab?: BrowserTab;

    constructor(options: Partial<ApplicationConfiguration> = {}) {
        super(options);

        this.settings = game.settings.get("pf2e", "compendiumBrowserPacks");
        this.tabs = {
            action: new browserTabs.Actions(this),
            bestiary: new browserTabs.Bestiary(this),
            campaignFeature: new browserTabs.CampaignFeatures(this),
            equipment: new browserTabs.Equipment(this),
            feat: new browserTabs.Feats(this),
            hazard: new browserTabs.Hazards(this),
            spell: new browserTabs.Spells(this),
        };
        this.tabsArray = R.values(this.tabs);

        this.initCompendiumList();
    }

    static override DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration> = {
        id: "compendium-browser",
        classes: ["compendium-browser"],
        position: {
            width: 800,
            height: 700,
        },
        window: {
            controls: [
                {
                    action: "openSettings",
                    icon: "fa-solid fa-cogs",
                    label: "PF2E.CompendiumBrowser.Settings.OpenSettings",
                },
                {
                    action: "addToRollTable",
                    icon: "fa-solid fa-list",
                    label: "PF2E.CompendiumBrowser.RollTable.AddLabel",
                },
                {
                    action: "createRollTable",
                    icon: "fa-solid fa-list",
                    label: "PF2E.CompendiumBrowser.RollTable.CreateLabel",
                },
            ],
            resizable: true,
            title: "PF2E.CompendiumBrowser.Title",
        },
        actions: {
            addToRollTable: () => {
                const browser = game.pf2e.compendiumBrowser;
                if (!browser.activeTab) return;
                browser.toggleControls();
                browser.activeTab.addToRollTable();
            },
            createRollTable: () => {
                const browser = game.pf2e.compendiumBrowser;
                if (!browser.activeTab) return;
                browser.toggleControls();
                browser.activeTab.createRollTable();
            },
            openSettings: () => {
                game.pf2e.compendiumBrowser.toggleControls();
                new CompendiumBrowserSettingsApp().render(true);
            },
        },
    };

    protected override _onFirstRender(context: object, options: ApplicationRenderOptions): void {
        super._onFirstRender(context, options);
        // Reset visible tabs when the browser was fully closed
        this.#setVisibleTabs();
    }

    protected override _onClose(options: ApplicationRenderOptions): void {
        super._onClose(options);
        for (const tab of this.tabsArray) {
            tab.filterData.search.text = "";
        }
    }

    protected override _getHeaderControls(): ApplicationHeaderControlsEntry[] {
        const controls = super._getHeaderControls();
        const gmControls = ["addToRollTable", "createRollTable", "openSettings"];
        for (const control of controls) {
            if (!game.user.isGM && gmControls.includes(control.action)) {
                control.visible = false;
            }
        }
        return controls;
    }

    #setVisibleTabs(visible?: ContentTabName[]): void {
        const isGM = game.user.isGM;
        const showCampaign = game.settings.get("pf2e", "campaignType") !== "none";
        for (const tab of this.tabsArray) {
            tab.visible = visible ? visible.includes(tab.tabName) : true;

            if (!showCampaign && tab.tabName === "campaignFeature") {
                tab.visible = false;
            }
            if (tab.isGMOnly && !isGM) {
                tab.visible = false;
            }
        }
    }

    #renderParts(parts: ("filter" | "resultList")[]): void {
        const props = compendiumBrowserContext;
        if (parts.includes("filter")) {
            props.filterKey = fu.randomID();
        }
        if (parts.includes("resultList")) {
            untrack(() => (props.results.length = 0));
            props.resultListKey = fu.randomID();
        }
    }

    async openTab(tabName: TabName, options?: CompendiumBrowserOpenTabOptions): Promise<void> {
        if (!this.dataTabsList.includes(tabName)) {
            throw ErrorPF2e(`Unknown tab "${tabName}"`);
        }

        this.activeTab = this.tabs[tabName];

        if (this.activeTab.isGMOnly && !game.user.isGM) {
            throw ErrorPF2e("Tried to open GM-only browser tab!");
        }
        if (options?.filter && !this.activeTab.isInitialized) {
            throw ErrorPF2e("Tried to pass filter data to an uninitialized tab!");
        }
        await this.activeTab.init();

        if (!this.rendered) {
            await this.render({ force: true });
        }
        const props = compendiumBrowserContext;

        if (options?.hideNavigation) {
            this.#setVisibleTabs([]);
        } else if (options?.showTabs) {
            if (!options.showTabs.every((t) => this.dataTabsList.includes(t))) {
                throw ErrorPF2e(`Unknown tab name in "${options.showTabs}"`);
            }
            // Always include the active tab name
            if (!options.showTabs.includes(tabName)) {
                options.showTabs.push(tabName);
            }
            this.#setVisibleTabs(options.showTabs);
        } else {
            this.#setVisibleTabs();
        }

        props.activeFilter = options?.filter ?? this.activeTab.filterData;
        if (props.activeTabName === tabName && this.rendered) {
            props.resultLimit = CompendiumBrowser.RESULT_LIMIT;
            untrack(() => (props.results = []));
            this.#renderParts(["filter", "resultList"]);
        } else {
            props.activeTabName = tabName;
        }

        this.bringToFront();
    }

    async openActionTab(options: {
        types?: ActionType[];
        categories?: ActionCategory[];
        traits?: AbilityTrait[];
    }): Promise<void> {
        const actionTab = this.tabs.action;
        const filter = await actionTab.getFilterData();
        const types = filter.checkboxes.types;
        const traits = filter.traits;

        types.selected = [];
        for (const type in types.options) {
            if (options.types?.includes(type as ActionType)) {
                types.options[type].selected = true;
                types.selected.push(type);
            }
        }

        const traitFilters = options.traits ?? [];
        traits.selected = traitFilters.length
            ? traits.options.filter((trait) => traitFilters.includes(trait.value))
            : [];

        if (options.categories?.length) {
            const optionsToSwitch = R.pick(filter.checkboxes.category.options, options.categories);
            Object.values(optionsToSwitch).forEach((o) => (o.selected = true));
            filter.checkboxes.category.selected = Object.keys(optionsToSwitch);
        }

        actionTab.open({ filter });
    }

    async openSpellTab(entry: BaseSpellcastingEntry, maxRank = 10, category: string | null = null): Promise<void> {
        const spellTab = this.tabs.spell;
        const filter = await spellTab.getFilterData();
        const traditions = filter.checkboxes.traditions;

        if (category && filter.checkboxes.category.options[category]) {
            filter.checkboxes.category.options[category].selected = true;
            filter.checkboxes.category.selected.push(category);
        }

        if (entry.isRitual || entry.isFocusPool) {
            filter.checkboxes.category.options[entry.category].selected = true;
            filter.checkboxes.category.selected.push(entry.category);
        }

        if (maxRank) {
            const ranks = Array.from(Array(maxRank).keys()).map((l) => String(l + 1));
            for (const rank of ranks) {
                filter.checkboxes.rank.options[rank].selected = true;
                filter.checkboxes.rank.selected.push(rank);
            }
            if ((entry.isPrepared || entry.isSpontaneous || entry.isInnate) && !category) {
                filter.checkboxes.category.options["spell"].selected = true;
                filter.checkboxes.category.selected.push("spell");
            }
        }

        if (entry.tradition && !entry.isFocusPool && !entry.isRitual) {
            traditions.options[entry.tradition].selected = true;
            traditions.selected.push(entry.tradition);
        }

        spellTab.open({ filter });
    }

    initCompendiumList(): void {
        const settings: Omit<TabData<Record<string, PackInfo | undefined>>, "settings"> = {
            action: {},
            bestiary: {},
            campaignFeature: {},
            hazard: {},
            equipment: {},
            feat: {},
            spell: {},
        };

        // NPCs and Hazards are all loaded by default, other packs can be set here.
        const loadDefault: Record<string, boolean | undefined> = {
            bestiary: true,
            hazard: true,
            "pf2e.actionspf2e": true,
            "pf2e.familiar-abilities": true,
            "pf2e.equipment-srd": true,
            "pf2e.ancestryfeatures": true,
            "pf2e.classfeatures": true,
            "pf2e.feats-srd": true,
            "pf2e.spells-srd": true,
            "pf2e.kingmaker-features": true,
        };

        const browsableTypes = new Set([
            "action",
            "campaignFeature",
            "feat",
            "kit",
            "hazard",
            "npc",
            "spell",
            ...PHYSICAL_ITEM_TYPES,
        ] as const);
        type BrowsableType = SetElement<typeof browsableTypes>;
        const typeToTab = new Map<ItemType | "hazard" | "npc", Exclude<TabName, "settings">>([
            ["action", "action"],
            ["campaignFeature", "campaignFeature"],
            ["feat", "feat"],
            ["kit", "equipment"],
            ["hazard", "hazard"],
            ["npc", "bestiary"],
            ["spell", "spell"],
            ...Array.from(PHYSICAL_ITEM_TYPES).map((t): [ItemType, "equipment"] => [t, "equipment"]),
        ]);

        for (const pack of game.packs) {
            const tabNames = R.unique(
                R.unique(pack.index.map((entry) => entry.type))
                    .filter((t): t is BrowsableType => setHasElement(browsableTypes, t))
                    .flatMap((t) => typeToTab.get(t) ?? []),
            );

            for (const tabName of tabNames) {
                const load =
                    this.settings[tabName]?.[pack.collection]?.load ??
                    loadDefault[tabName] ??
                    !!loadDefault[pack.collection];
                settings[tabName]![pack.collection] = {
                    load,
                    name: pack.metadata.label,
                    package: pack.metadata.packageName,
                };
            }
        }

        for (const tab of this.dataTabsList) {
            settings[tab] = Object.fromEntries(
                Object.entries(settings[tab]!).sort(([_collectionA, dataA], [_collectionB, dataB]) => {
                    return (dataA?.name ?? "") > (dataB?.name ?? "") ? 1 : -1;
                }),
            );
        }

        this.settings = settings;
    }

    loadedPacks(tab: TabName): string[] {
        return Object.entries(this.settings[tab] ?? []).flatMap(([collection, info]) => {
            return info?.load ? [collection] : [];
        });
    }

    loadedPacksAll(): string[] {
        return R.unique(this.dataTabsList.flatMap((t) => this.loadedPacks(t))).sort();
    }

    async resetInitializedTabs(): Promise<void> {
        for (const tab of this.tabsArray) {
            if (tab.isInitialized) {
                await tab.init(true);
            }
        }
        compendiumBrowserContext.activeTabName = "";
    }
}

interface CompendiumBrowserContext {
    /** Changing this will trigger a tab rerender. An empty string will show the landing page. */
    activeTabName: ContentTabName | "";
    /** The currently rendered filter */
    activeFilter?: BrowserFilter;
    /** Changing this will trigger a filter rerender. */
    filterKey: string;
    /** The currently rendered result items */
    results: CompendiumBrowserIndexData[];
    /** The maximum amount of rendered result items */
    resultLimit: number;
    /** Changing this wil trigger a result list rerender. */
    resultListKey: string;
}
// This is imported as needed by svelte components for easy access to these values
const compendiumBrowserContext: CompendiumBrowserContext = $state({
    activeTabName: "",
    activeFilter: undefined,
    filterKey: fu.randomID(),
    results: [],
    resultLimit: CompendiumBrowser.RESULT_LIMIT,
    resultListKey: fu.randomID(),
});

type CompendiumBrowserSettings = Omit<TabData<Record<string, PackInfo | undefined>>, "settings">;

type CompendiumBrowserSourcesList = Record<string, SourceInfo | undefined>;
interface CompendiumBrowserSources {
    ignoreAsGM: boolean;
    showEmptySources: boolean;
    showUnknownSources: boolean;
    sources: CompendiumBrowserSourcesList;
}

interface CompendiumBrowserOpenTabOptions {
    /** Optional filter data for the opened tab */
    filter?: BrowserFilter;
    /** Hide the navigation element */
    hideNavigation?: boolean;
    /** Only show the given tabs in the navigation element. This will always include the openend tab */
    showTabs?: ContentTabName[];
}

export { CompendiumBrowser, compendiumBrowserContext };
export type {
    CompendiumBrowserContext,
    CompendiumBrowserOpenTabOptions,
    CompendiumBrowserSettings,
    CompendiumBrowserSources,
};
