import { CanvasReady } from "./canvas-ready.ts";
import { CloseCombatTrackerConfig } from "./close-combat-tracker-config.ts";
import { CloseWorldClockSettings } from "./close-world-clock-settings.ts";
import { DiceSoNiceReady } from "./dice-so-nice-ready.ts";
import { DiceSoNiceRollStart } from "./dice-so-nice-roll-start.ts";
import { DropCanvasData } from "./drop-canvas-data.ts";
import { GetSceneControlButtons } from "./get-scene-control-buttons.ts";
import { I18nInit } from "./i18n-init.ts";
import { Init } from "./init.ts";
import { LightingRefresh } from "./lighting-refresh.ts";
import { Load } from "./load.ts";
import { Ready } from "./ready.ts";
import { RenderChatPopout } from "./render-chat-popout.ts";
import { RenderCombatTrackerConfig } from "./render-combat-tracker-config.ts";
import { RenderDialog } from "./render-dialog.ts";
import { RenderJournalTextPageSheet } from "./render-journal-text-page-sheet.ts";
import { RenderRegionLegend } from "./render-region-legend.ts";
import { RenderSettingsConfig } from "./render-settings-config.ts";
import { RenderSettings } from "./render-settings.ts";
import { RenderTokenHUD } from "./render-token-hud.ts";
import { Setup } from "./setup.ts";
import { TargetToken } from "./target-token.ts";
import { UpdateWorldTime } from "./update-world-time.ts";

export const HooksPF2e = {
    listen(): void {
        const listeners: { listen(): void }[] = [
            Load, // Run this first since it's not an actual hook listener
            CanvasReady,
            CloseCombatTrackerConfig,
            CloseWorldClockSettings,
            DiceSoNiceReady,
            DiceSoNiceRollStart,
            DropCanvasData,
            GetSceneControlButtons,
            I18nInit,
            Init,
            LightingRefresh,
            Ready,
            RenderChatPopout,
            RenderCombatTrackerConfig,
            RenderDialog,
            RenderJournalTextPageSheet,
            RenderRegionLegend,
            RenderSettings,
            RenderSettingsConfig,
            RenderTokenHUD,
            Setup,
            TargetToken,
            UpdateWorldTime,
        ];
        for (const Listener of listeners) {
            Listener.listen();
        }
    },
};
