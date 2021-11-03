import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Icon, List, ListItem } from "@ui-kitten/components";
import { EntryType, EntryURLType, GroupID, PropertyKeyValueObject, getEntryURLs } from "buttercup";
import { SiteIcon } from "../../media/SiteIcon";
import { extractDomain } from "../../../library/url";
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
      paddingVertical: 4,
    },
    item: {
      marginVertical: 4,
    },
    listContainer: {}
});

function getEntryDomain(entryProperties: PropertyKeyValueObject): string | null {
    const [url] = [
      ...getEntryURLs(entryProperties, EntryURLType.Icon),
      ...getEntryURLs(entryProperties, EntryURLType.Any)
    ];
    return url ? extractDomain(url) : null;
}

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
        icon: item.type === "group" ? "folder-outline" : null,
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
                item.icon
                    ? (
                        <Icon name={item.icon} />
                    )
                    : (
                        <SiteIcon
                            domain={getEntryDomain(item.sourceItem.entryProperties ?? {})}
                            size={28}
                            type={item.sourceItem.entryType || EntryType.Login}
                        />
                    )
            }
            onPress={() => {
                if (!groupID && item.sourceItem.groupID && item.sourceItem.type === "entry") {
                    navigation.push(
                        "EntryDetails",
                        {
                            entryID: item.sourceItem.id,
                            groupID: item.sourceItem.groupID
                        }
                    );
                } else if (item.sourceItem.type === "group") {
                    navigation.push(
                        "VaultContents",
                        {
                            groupID: item.sourceItem.id
                        }
                    );
                } else if (groupID && item.sourceItem.type === "entry") {
                    // Entry
                    navigation.push(
                        "EntryDetails",
                        {
                            entryID: item.sourceItem.id,
                            groupID
                        }
                    );
                }
            }}
        />
    );
}

export interface VaultContentsListProps {
    contents: Array<VaultContentsItem>;
    groupID?: GroupID;
    navigation: any;
}

export function VaultContentsList(props: VaultContentsListProps) {
    const preparedContents = useMemo(() => prepareListContents(props.contents), [props.contents]);
    const renderWrapper = useCallback(
        (info: RenderInfo) => renderItem(info, props.navigation, props.groupID),
        [props.groupID, props.navigation]
    );
    return (
        <List
            style={styles.listContainer}
            contentContainerStyle={styles.contentContainer}
            data={preparedContents}
            renderItem={renderWrapper}
        />
    );
}
