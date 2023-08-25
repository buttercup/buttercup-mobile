import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Icon, Layout, List, ListItem } from "@ui-kitten/components";
import { EntryType, GroupID } from "buttercup";
import { SiteIcon } from "../../media/SiteIcon";
import { EmptyState } from "../../EmptyState";
import { getEntryDomain } from "../../../library/entry";
import { VaultContentsItem } from "../../../types";

interface RenderInfo {
    item: VaultContentsItemDisplay;
}
interface VaultContentsItemDisplay {
    title: string;
    subtitle: string | null;
    icon: string;
    sourceItem: VaultContentsItem;
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 0
    },
    contentContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    item: {
        marginVertical: 4
    },
    listContainer: {},
    noEntriesLayout: {
        height: "100%"
    }
});

function prepareEntrySubtitle(item: VaultContentsItem): string {
    switch (item.entryType) {
        case EntryType.Login:
            return item.entryProperties?.username ?? null;
        case EntryType.Website: {
            const items = [];
            item.entryProperties?.username && items.push(item.entryProperties.username);
            item.entryProperties?.url && items.push(item.entryProperties.url);
            return items.join(" @ ") || null;
        }
        case EntryType.CreditCard:
            return item.entryProperties?.username ?? null;
        case EntryType.SSHKey:
        case EntryType.Note:
        default:
            return null;
    }
}

function prepareListContents(items: Array<VaultContentsItem>): Array<VaultContentsItemDisplay> {
    return items.map(item => ({
        title: item.title,
        subtitle: item.type === "group" ? null : prepareEntrySubtitle(item),
        icon: item.type === "group" ? (item.isTrash ? "trash-2-outline" : "folder-outline") : null,
        sourceItem: item
    }));
}

function renderItem(info: RenderInfo, navigation: any, groupID?: GroupID) {
    const { item } = info;
    return (
        <ListItem
            title={item.title}
            description={item.subtitle}
            accessoryLeft={
                item.icon ? (
                    <Icon name={item.icon} />
                ) : (
                    <SiteIcon
                        domain={getEntryDomain(item.sourceItem.entryProperties ?? {})}
                        size={28}
                        type={item.sourceItem.entryType || EntryType.Login}
                    />
                )
            }
            onPress={() => {
                if (!groupID && item.sourceItem.groupID && item.sourceItem.type === "entry") {
                    navigation.push("EntryDetails", {
                        entryID: item.sourceItem.id,
                        groupID: item.sourceItem.groupID
                    });
                } else if (item.sourceItem.type === "group") {
                    navigation.push("VaultContents", {
                        groupID: item.sourceItem.id
                    });
                } else if (groupID && item.sourceItem.type === "entry") {
                    // Entry
                    navigation.push("EntryDetails", {
                        entryID: item.sourceItem.id,
                        groupID
                    });
                }
            }}
        />
    );
}

export interface VaultContentsListProps {
    contents: Array<VaultContentsItem>;
    groupID?: GroupID;
    navigation: any;
    type: "search" | "group";
}

export function VaultContentsList(props: VaultContentsListProps) {
    const { type } = props;
    const preparedContents = useMemo(() => prepareListContents(props.contents), [props.contents]);
    const { title: emptyStateTitle, description: emptyStateDescription } = useMemo(() => {
        if (type === "search") {
            return {
                title: "No Results",
                description: "No entries found for current search."
            };
        }
        return {
            title: "No Items",
            description: "This group is empty."
        };
    }, [type]);
    const renderWrapper = useCallback(
        (info: RenderInfo) => renderItem(info, props.navigation, props.groupID),
        [props.groupID, props.navigation]
    );
    return (
        <>
            {preparedContents.length > 0 && (
                <List
                    style={styles.listContainer}
                    contentContainerStyle={styles.contentContainer}
                    data={preparedContents}
                    renderItem={renderWrapper}
                />
            )}
            {preparedContents.length === 0 && (
                <Layout level="2" style={styles.noEntriesLayout}>
                    <EmptyState
                        title={emptyStateTitle}
                        description={emptyStateDescription}
                        icon="square-outline"
                    />
                </Layout>
            )}
        </>
    );
}
