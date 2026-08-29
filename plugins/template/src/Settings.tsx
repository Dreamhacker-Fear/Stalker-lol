import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";

const { FormSection, FormRow, FormInput } = Forms;

function Toggle({
    title,
    description,
    value,
    onChange,
}: {
    title: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <FormRow
            label={title}
            subLabel={description}
            trailing={
                <Forms.FormSwitch
                    value={value}
                    onValueChange={onChange}
                />
            }
        />
    );
}

export default function Settings() {
    return (
        <>
            <FormSection title="Activity Tracker">
                <Toggle
                    title="Enable Tracker"
                    description="Turn activity tracking on or off."
                    value={storage.enabled ?? false}
                    onChange={(value) => {
                        storage.enabled = value;
                    }}
                />
            </FormSection>

            <FormSection title="Tracking Target">
                <Toggle
                    title="Track Friends"
                    description="Track activity from people on your friends list."
                    value={storage.trackFriends ?? false}
                    onChange={(value) => {
                        storage.trackFriends = value;
                    }}
                />

                <Toggle
                    title="Track Selected User"
                    description="Track one specific user."
                    value={storage.trackSelected ?? false}
                    onChange={(value) => {
                        storage.trackSelected = value;
                    }}
                />

                <FormInput
                    title="Selected User ID"
                    subLabel="Enter the Discord user ID to track."
                    value={storage.selectedUserId ?? ""}
                    placeholder="User ID"
                    onChange={(value: string) => {
                        storage.selectedUserId = value;
                    }}
                />
            </FormSection>

            <FormSection title="Tracking Locations">
                <Toggle
                    title="Servers"
                    description="Show activity from servers you are in."
                    value={storage.trackServers ?? true}
                    onChange={(value) => {
                        storage.trackServers = value;
                    }}
                />

                <Toggle
                    title="Group DMs"
                    description="Show activity from group conversations."
                    value={storage.trackGroupDMs ?? false}
                    onChange={(value) => {
                        storage.trackGroupDMs = value;
                    }}
                />

                <Toggle
                    title="Direct Messages"
                    description="Show activity from direct messages."
                    value={storage.trackDMs ?? false}
                    onChange={(value) => {
                        storage.trackDMs = value;
                    }}
                />
            </FormSection>

            <FormSection title="Report Settings">
                <Toggle
                    title="Channel Reporting"
                    description="Send approved activity reports to a configured channel."
                    value={storage.channelReporting ?? false}
                    onChange={(value) => {
                        storage.channelReporting = value;
                    }}
                />

                <FormInput
                    title="Target Channel ID"
                    subLabel="Enter the channel ID where reports should go."
                    value={storage.targetChannelId ?? ""}
                    placeholder="Channel ID"
                    onChange={(value: string) => {
                        storage.targetChannelId = value;
                    }}
                />

                <Toggle
                    title="User Information"
                    description="Include the user's name in activity information."
                    value={storage.includeUser ?? true}
                    onChange={(value) => {
                        storage.includeUser = value;
                    }}
                />

                <Toggle
                    title="Server & Channel"
                    description="Include where the activity occurred."
                    value={storage.includeLocation ?? true}
                    onChange={(value) => {
                        storage.includeLocation = value;
                    }}
                />

                <Toggle
                    title="Message Link"
                    description="Include a link to the original message."
                    value={storage.includeLink ?? true}
                    onChange={(value) => {
                        storage.includeLink = value;
                    }}
                />
            </FormSection>

            <FormSection title="Notifications">
                <Toggle
                    title="Local Notifications"
                    description="Show an activity notification on your device."
                    value={storage.localNotifications ?? true}
                    onChange={(value) => {
                        storage.localNotifications = value;
                    }}
                />

                <Toggle
                    title="Notification Sound"
                    description="Play a sound when a notification appears."
                    value={storage.notificationSound ?? false}
                    onChange={(value) => {
                        storage.notificationSound = value;
                    }}
                />
            </FormSection>
        </>
    );
}
