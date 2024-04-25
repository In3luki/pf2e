import { ItemSourcePF2e } from "@item/base/data/index.ts";
import { MigrationBase } from "../base.ts";

/** Indicate whether a feat must be taken at level 1 or may only be taken a limited number of times */
export class Migration717TakeFeatLimits extends MigrationBase {
    static override version = 0.717;

    private levelOneOnly = new Set([
        "celestial-eyes",
        "chance-death",
        "deliberate-death",
        "elemental-eyes",
        "eyes-of-the-night",
        "fiendish-eyes",
        "gravesight",
        "willing-death",
    ]);

    private maxTakeable: Record<string, number> = {
        "additional-lore": Number.POSITIVE_INFINITY,
        "advanced-domain": Number.POSITIVE_INFINITY,
        "advanced-general-training": Number.POSITIVE_INFINITY,
        "animal-senses": Number.POSITIVE_INFINITY,
        "animal-senses-darkvision": Number.POSITIVE_INFINITY,
        "animal-senses-low-light-vision": Number.POSITIVE_INFINITY,
        "animal-senses-scent-imprecise": Number.POSITIVE_INFINITY,
        "armor-proficiency": 3,
        assurance: Number.POSITIVE_INFINITY,
        "automatic-knowledge": Number.POSITIVE_INFINITY,
        "blessing-of-the-sun-gods": Number.POSITIVE_INFINITY,
        "consult-the-spirits": Number.POSITIVE_INFINITY,
        "domain-initiate": Number.POSITIVE_INFINITY,
        "general-training": Number.POSITIVE_INFINITY,
        "greater-animal-senses": Number.POSITIVE_INFINITY,
        "greater-sun-blessing": Number.POSITIVE_INFINITY,
        "hellknight-order-cross-training": Number.POSITIVE_INFINITY,
        "living-weapon": Number.POSITIVE_INFINITY,
        "magic-arrow": Number.POSITIVE_INFINITY,
        "modular-dynamo": Number.POSITIVE_INFINITY,
        multilingual: Number.POSITIVE_INFINITY,
        "settlement-scholastics": Number.POSITIVE_INFINITY,
        "skill-training": Number.POSITIVE_INFINITY,
        "terrain-stalker": Number.POSITIVE_INFINITY,
    };

    override async updateItem(source: ItemSourcePF2e): Promise<void> {
        if (source.type !== "feat") return;

        const slug = source.system.slug ?? "";

        // Set level-one-only restriction
        const traits = source.system.traits.value;
        if (traits.includes("lineage") || this.levelOneOnly.has(slug)) {
            source.system.onlyLevel1 = true;
        } else if ("game" in globalThis) {
            source.system.onlyLevel1 = false;
        }

        if (!source.system.onlyLevel1 && slug in this.maxTakeable) {
            source.system.maxTakable = this.maxTakeable[slug];
        } else if ("game" in globalThis) {
            source.system.maxTakable = 1;
        }
    }
}
