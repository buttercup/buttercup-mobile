import React, { Fragment, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { EntryPropertyType, EntryPropertyValueType } from "buttercup";
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
import { EntryFieldValue, VisibleField } from "./vault-contents/EntryFieldValue";
import { useEntryFacade } from "../../hooks/buttercup";
import { useEntryOTPCodes } from "../../hooks/otp";
import { CURRENT_SOURCE } from "../../state/vault";
import { humanReadableEntryType } from "../../library/entry";

const MENU_ITEMS = [
    { text: "Edit Entry", slug: "edit", icon: "edit-outline" },
    { text: "Delete Entry", slug: "delete", icon: "trash-2-outline", disabled: true }
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
    }
});

function MenuButton(props) {
    const { entryID, groupID, navigation } = props;
    const [visible, setVisible] = useState(false);
    const onItemSelect = selected => {
        const item = MENU_ITEMS[selected.row];
        setVisible(false);
        if (item.slug === "edit") {
            navigation.navigate("EditEntry", {
                entryID,
                groupID
            });
        }
    };
    const renderToggleButton = () => (
        <Button
            {...props}
            appearance="ghost"
            accessoryLeft={MenuIcon}
            onPress={() => setVisible(true)}
        />
    );
    return (
        <Layout style={styles.menuContent} level="1">
            <OverflowMenu
                anchor={renderToggleButton}
                visible={visible}
                onSelect={onItemSelect}
                onBackdropPress={() => setVisible(false)}
            >
                {MENU_ITEMS.map(item => (
                    <MenuItem
                        disabled={!!item.disabled}
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
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation
                title={title}
                alignment="center"
                accessoryLeft={BackAction}
                accessoryRight={props => <MenuButton {...props} entryID={entryID} groupID={groupID} navigation={navigation} />}
            />
            <Divider />
            <Layout style={styles.bodyLayout}>
                <ScrollView style={styles.scrollView}>
                    <Text category="h2">{title}</Text>
                    <Text appearance="hint">{subtitle}</Text>
                    <Layout style={styles.fieldsLayout}>
                        {visibleFields.map((field, index) => (
                            <Fragment key={field.key}>
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
                            </Fragment>
                        ))}
                    </Layout>
                </ScrollView>
            </Layout>
        </SafeAreaView>
    );
}
