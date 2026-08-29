import { findByProps, findByStoreName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const patches: (() => void)[] = [];

function getCurrentUserId(): string | null {
    try {
        return findByStoreName("UserStore")
            ?.getCurrentUser?.()
            ?.id ?? null;
    } catch {
        return null;
    }
}

function isTrackedUser(userId: string): boolean {
    if (!storage.enabled) return false;

    if (userId === getCurrentUserId()) return false;

    if (
        storage.trackSelected &&
        storage.selectedUserId &&
        userId === storage.selectedUserId
    ) {
        return true;
    }

    if (storage.trackFriends) {
        try {
            const RelationshipStore =
                findByProps(
                    "getRelationships",
                    "getFriendIDs",
                );

            const friends =
                RelationshipStore?.getFriendIDs?.() ?? [];

            if (friends.includes(userId)) {
                return true;
            }
        } catch {}
    }

    return false;
}

function getLocation(channelId: string) {
    try {
        const ChannelStore =
            findByStoreName("ChannelStore");

        const channel =
            ChannelStore?.getChannel?.(channelId);

        if (!channel) return null;

        const GuildStore =
            findByStoreName("GuildStore");

        const guild =
            channel.guild_id
                ? GuildStore?.getGuild?.(channel.guild_id)
                : null;

        return {
            channelId: channel.id,
            channelName: channel.name ?? "Unknown Channel",
            guildId: channel.guild_id ?? null,
            guildName: guild?.name ?? "Direct Message",
        };
    } catch {
        return null;
    }
}

function showNotification(message: string) {
    if (!storage.localNotifications) return;

    try {
        const { showToast } =
            findByProps("showToast");

        showToast?.(message);
    } catch {}
}

function createReport(
    message: any,
    location: any,
) {
    const lines: string[] = [
        "MESSAGE DETECTED",
        "",
    ];

    if (storage.includeUser) {
        lines.push(
            `User: ${message.author?.username ?? "Unknown"}`,
            `ID: ${message.author?.id ?? "Unknown"}`,
        );
    }

    if (storage.includeLocation) {
        lines.push(
            "",
            `Server: ${location.guildName}`,
            `Channel: #${location.channelName}`,
        );
    }

    if (storage.includeLink && location.guildId) {
        lines.push(
            "",
            `https://discord.com/channels/${location.guildId}/${location.channelId}/${message.id}`,
        );
    }

    return lines.join("\n");
}

export default {
    settings: () => import("./Settings"),

    onLoad() {
        storage.enabled ??= false;
        storage.trackFriends ??= false;
        storage.trackSelected ??= false;
        storage.trackServers ??= true;
        storage.trackGroupDMs ??= false;
        storage.trackDMs ??= false;
        storage.channelReporting ??= false;
        storage.localNotifications ??= true;
        storage.notificationSound ??= false;
        storage.includeUser ??= true;
        storage.includeLocation ??= true;
        storage.includeLink ??= true;

        console.log("[ActivityTracker] Loaded");

        /*
         * This intentionally only provides the local notification/
         * detection foundation. It does not silently forward another
         * person's messages to a remote channel.
         */
    },

    onUnload() {
        for (const unpatch of patches) {
            try {
                unpatch();
            } catch {}
        }

        patches.length = 0;
    },
};
