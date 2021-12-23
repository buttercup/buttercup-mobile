import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { EntryID, EntryPropertyType, EntryPropertyValueType, GroupID, fieldsToProperties, VaultSourceID } from "buttercup";
import {
    Button,
    Divider,
    Icon,
    Layout,
    MenuItem,
    OverflowMenu,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import Clipboard from "@react-native-community/clipboard";
import { EntryFieldValue, VisibleField } from "./vault-contents/EntryFieldValue";
import { ConfirmPrompt } from "../prompts/ConfirmPrompt";
import { SiteIcon } from "../media/SiteIcon";
import { useEntryFacade } from "../../hooks/buttercup";
import { useEntryOTPCodes } from "../../hooks/otp";
import { CURRENT_SOURCE } from "../../state/vault";
import { setBusyState } from "../../services/busyState";
import { deleteEntry } from "../../services/buttercup";
import { getEntryDomain, humanReadableEntryType } from "../../library/entry";
import { notifyError, notifySuccess } from "../../library/notifications";

const MENU_ITEMS = [
    { text: "Edit Entry", slug: "edit", icon: "edit-outline" },
    { text: "Delete Entry", slug: "delete", icon: "trash-2-outline" }
];

const BackIcon = props => <Icon {...props} name="arrow-back" />;

const styles = StyleSheet.create({
    bodyLayout: {
        flex: 1
    },
    fieldLayout: {
        marginVertical: 8
    },
    fieldsLayout: {
        marginTop: 15,
        width: "100%"
    },
    menuContent: {},
    scrollView: {
        paddingHorizontal: 14,
        paddingVertical: 7
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch"
    },
    titleTextContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexShrink: 2
    },
    titleText: {
        flex: 1,
        overflow: "hidden"
    }
});

interface MenuButtonProps {
    entryID: EntryID;
    groupID: GroupID;
    navigation: any;
    onDeleteEntry: () => void;
    onVisibleChange: (visible: boolean) => void;
    visible: boolean;
}

function MenuButton(props: MenuButtonProps) {
    const { entryID, groupID, navigation, onDeleteEntry, onVisibleChange, visible } = props;
    const onItemSelect = useCallback(selected => {
        const item = MENU_ITEMS[selected.row];
        onVisibleChange(false);
        if (item.slug === "edit") {
            navigation.navigate("EditEntry", {
                entryID,
                groupID
            });
        } else if (item.slug === "delete") {
            onDeleteEntry();
        }
    }, [navigation, onVisibleChange]);
    const renderToggleButton = () => (
        <Button
            {...props}
            appearance="ghost"
            accessoryLeft={MenuIcon}
            onPress={() => onVisibleChange(true)}
            status="basic"
        />
    );
    return (
        <Layout style={styles.menuContent} level="1">
            <OverflowMenu
                anchor={renderToggleButton}
                visible={visible}
                onSelect={onItemSelect}
                onBackdropPress={() => onVisibleChange(false)}
            >
                {MENU_ITEMS.map(item => (
                    <MenuItem
                        key={item.slug}
                        title={item.text}
                        accessoryLeft={props => <Icon {...props} name={item.icon} />}
                    />
                ))}
            </OverflowMenu>
        </Layout>
    );
}

function MenuIcon(props) {
    return <Icon {...props} name="options-2-outline" />;
}

export function EntryDetailsScreen({ navigation, route }) {
    const { entryID, groupID } = route?.params ?? {};
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const entryFacade = useEntryFacade(currentSourceState.get(), entryID);
    const [entryMenuVisible, setEntryMenuVisible] = useState(false);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const title = useMemo(() => {
        if (!entryFacade) return "";
        const titleField = entryFacade.fields.find(field => field.property === "title" && field.propertyType === EntryPropertyType.Property);
        return titleField && titleField.value || "";
    }, [entryFacade]);
    const subtitle = useMemo(() => {
        if (!entryFacade) return "";
        return entryFacade.type ? humanReadableEntryType(entryFacade.type) : "Unknown entry type";
    }, [entryFacade]);
    const entryOTPs = useEntryOTPCodes(entryID);
    const visibleFields: Array<VisibleField> = useMemo(() => {
        if (!entryFacade) return [];
        return entryFacade.fields.reduce<Array<VisibleField>>((output, field) => {
            if (field.propertyType === EntryPropertyType.Attribute) return output;
            if (field.property === "title") return output;
            return [
                ...output,
                {
                    key: field.id,
                    property: field.property,
                    removeable: field.removeable,
                    title: field.title || field.property,
                    value: field.value,
                    valueType: field.valueType
                }
            ];
        }, []);
    }, [entryFacade]);
    const keyValueProperties = useMemo(() => fieldsToProperties(entryFacade?.fields ?? []), [entryFacade]);
    const entryDomain = useMemo(() => getEntryDomain(keyValueProperties) || null, [keyValueProperties]);
    const handleEntryDeletion = useCallback(async () => {
        setBusyState("Deleting Entry");
        setShowDeletePrompt(false);
        try {
            await deleteEntry(currentSourceState.get(), entryID);
            setBusyState(null);
            navigation.goBack();
            notifySuccess("Entry deleted", "Successfully deleted entry");
        } catch (err) {
            setBusyState(null);
            console.error(err);
            notifyError("Failed deleting entry", err.message);
        }
    }, [entryID, currentSourceState.get()]);
    const handleFieldPress = useCallback((field: VisibleField) => {
        Clipboard.setString(field.value);
        notifySuccess("Field Copied", `Copied '${field.property}' value`);
    }, []);
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    const EntryMenu = useCallback(props => <MenuButton
        {...props}
        entryID={entryID}
        groupID={groupID}
        navigation={navigation}
        onDeleteEntry={() => setShowDeletePrompt(true)}
        onVisibleChange={setEntryMenuVisible}
        visible={entryMenuVisible}
    />, [entryID, groupID, entryMenuVisible]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation
                title={title}
                alignment="center"
                accessoryLeft={BackAction}
                accessoryRight={EntryMenu}
            />
            <Divider />
            <Layout style={styles.bodyLayout}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.titleContainer}>
                        <View style={styles.titleTextContainer}>
                            <Text category="h5" numberOfLines={1} style={styles.titleText}>{title}</Text>
                            <Text appearance="hint" numberOfLines={1}>{subtitle}</Text>
                        </View>
                        <View>
                            <SiteIcon domain={entryDomain} size={48} type={entryFacade?.type} />
                        </View>
                    </View>
                    <Layout style={styles.fieldsLayout}>
                        {visibleFields.map((field, index) => (
                            <TouchableOpacity activeOpacity={0.3} onPress={() => handleFieldPress(field)} key={field.key}>
                                <Layout key={field.key} style={styles.fieldLayout}>
                                    {field.valueType !== EntryPropertyValueType.Note && (
                                        <Text category="h6">{field.title}</Text>
                                    )}
                                    <EntryFieldValue
                                        info={field}
                                        otp={entryOTPs[field.property] || null}
                                    />
                                </Layout>
                                {index < (visibleFields.length - 1) && (
                                    <Divider key={`d${field.key}`} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </Layout>
                </ScrollView>
            </Layout>
            <ConfirmPrompt
                cancelable
                confirmText="Delete Entry"
                onCancel={() => setShowDeletePrompt(false)}
                onConfirm={handleEntryDeletion}
                prompt="Are you sure to want to delete this entry?"
                title="Delete Entry"
                visible={showDeletePrompt}
            />
        </SafeAreaView>
    );
}
