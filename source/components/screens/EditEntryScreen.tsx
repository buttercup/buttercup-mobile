import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import {
    FIELD_VALUE_TYPES,
    EntryID,
    EntryPropertyType,
    EntryPropertyValueType,
    EntryType,
    createEntryFacade,
    createFieldDescriptor,
    setEntryFacadePropertyValueType,
    EntryFacadeField
} from "buttercup";
import {
    Button,
    Divider,
    Icon,
    IndexPath,
    Input,
    Layout,
    MenuItem,
    OverflowMenu,
    Select,
    SelectItem,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import { useSingleState } from "react-obstate";
import { ConfirmPrompt } from "../prompts/ConfirmPrompt";
import { TextPrompt } from "../prompts/TextPrompt";
import { ItemsPrompt, PromptItem } from "../prompts/ItemsPrompt";
import { notifyError, notifySuccess } from "../../library/notifications";
import { usePendingOTPs } from "../../hooks/otp";
import { VAULT } from "../../state/vault";
import { GENERATOR, GeneratorMode } from "../../state/generator";
import { getEntryFacade, saveExistingEntryChanges, saveNewEntry } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { OTP } from "../../types";
import { OTPScannerModal } from "../modals/OTPScannerModal";

const BackIcon = props => <Icon {...props} name="arrow-back" />;
// const DeleteIcon = props => <Icon {...props} name="trash-2-outline" />;
const ModifyIcon = props => <Icon {...props} name="settings-outline" />;
const SaveIcon = props => <Icon {...props} name="save-outline" />;
const TitleIcon = props => <Icon {...props} name="text-outline" />;
const CameraIcon = props => <Icon {...props} name="camera-outline" />;

interface FieldEditMenuButtonProps {
    entryID: EntryID;
    items: Array<FieldModifyMenuItem>;
    navigation: any;
}
interface FieldModifyMenuItem {
    disabled?: boolean;
    icon: string;
    onSelect?: () => void;
    text: string;
    slug: string;
}

const { MONO_FONT } = Platform.select({
    ios: {
        MONO_FONT: "Courier New"
    },
    android: {
        MONO_FONT: "monospace"
    }
});

const styles = StyleSheet.create({
    additionalButton: {
        marginTop: 8
    },
    bodyLayout: {
        flex: 1
    },
    deleteButton: {
        marginLeft: 6,
        width: 36
    },
    fieldEditMenuContent: {},
    fieldLayout: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        marginTop: 8,
        marginBottom: 14
    },
    fieldsLayout: {
        marginTop: 15,
        width: "100%"
    },
    fieldValueLayout: {
        marginRight: 0,
        marginLeft: "auto"
    },
    input: {
        flex: 1
    },
    inputContainerLayout: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "stretch"
    },
    inputLabel: {
        marginBottom: 3
    },
    modifyButton: {
        marginLeft: 6,
        width: 36,
        height: 20
    },
    cameraButton: {
        marginLeft: 6,
        width: 36,
        height: 20
    },
    passwordInput: {
        fontFamily: MONO_FONT
    },
    scrollView: {
        paddingHorizontal: 14,
        paddingVertical: 7
    }
});

function FieldEditMenuButton(props: FieldEditMenuButtonProps) {
    const { /*entryID,*/ items: rawItems, navigation } = props;
    const items = useMemo(() => rawItems.filter(item => !!item), [rawItems]);
    const [_, setGeneratorMode] = useSingleState(GENERATOR, "mode");
    const [visible, setVisible] = useState(false);
    const onItemSelect = selected => {
        const item = items[selected.row];
        setVisible(false);
        if (item.slug === "generate-password") {
            setGeneratorMode(GeneratorMode.EntryProperty);
            navigation.navigate("Modal", { screen: "PasswordGenerator" });
        }
        // if (item.slug === "edit") {
        //     navigation.navigate("EditEntry", {
        //         entryID
        //     });
        // }
    };
    const renderToggleButton = () => (
        <Button
            {...props}
            accessoryLeft={ModifyIcon}
            onPress={() => setVisible(true)}
            status="control"
            style={styles.modifyButton}
        />
    );
    return (
        <Layout style={styles.fieldEditMenuContent} level="1">
            <OverflowMenu
                anchor={renderToggleButton}
                visible={visible}
                onSelect={onItemSelect}
                onBackdropPress={() => setVisible(false)}
            >
                {items.map(item => (
                    <MenuItem
                        disabled={!!item.disabled}
                        key={item.slug}
                        onPress={() => (item.onSelect ? item.onSelect() : null)}
                        title={item.text}
                        accessoryLeft={props => <Icon {...props} name={item.icon} />}
                    />
                ))}
            </OverflowMenu>
        </Layout>
    );
}

function OTPScannerButton({ onScanSuccess }: { onScanSuccess: (data: string) => void }) {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <OTPScannerModal
                visible={visible}
                onBackdropPress={() => setVisible(false)}
                onScan={response => {
                    onScanSuccess(response);
                    setVisible(false);
                }}
            />
            <Button
                accessoryLeft={CameraIcon}
                onPress={() => setVisible(true)}
                status="control"
                style={styles.cameraButton}
            />
        </>
    );
}

export function EditEntryScreen({ navigation, route }) {
    const { entryID = null, entryType, groupID } = route?.params ?? {};
    const [currentSource] = useSingleState(VAULT, "currentSource");
    const [lastPassword, setLastPassword] = useSingleState(GENERATOR, "lastPassword");
    const [entryFacade, setEntryFacade] = useState(null);
    const [changed, setChanged] = useState(false);
    const title = useMemo(() => {
        if (!entryFacade) return "";
        const titleField = entryFacade.fields.find(
            field => field.property === "title" && field.propertyType === EntryPropertyType.Property
        );
        return (titleField && titleField.value) || "";
    }, [entryFacade]);
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [confirmDeleteFieldID, setConfirmDeleteFieldID] = useState<string>(null);
    const [promptingNewField, setPromptingNewField] = useState(false);
    const [changeTypeFieldID, setChangeTypeFieldID] = useState<string>(null);
    const [generatePasswordFieldID, setGeneratePasswordFieldID] = useState<string>(null);
    const { pendingOTPs, removePendingOTP } = usePendingOTPs();
    const [promptingPendingOTP, setPromptingPendingOTP] = useState(false);
    const pendingOTPItems: Array<PromptItem> = useMemo(
        () =>
            pendingOTPs.map((pendingOTP: OTP) => ({
                title: pendingOTP.otpTitle,
                slug: pendingOTP.otpURL,
                icon: "keypad-outline"
            })),
        [pendingOTPs]
    );
    const handleFieldValueChange = useCallback(
        (fieldID: string, newValue: string) => {
            setChanged(true);
            setEntryFacade({
                ...entryFacade,
                fields: entryFacade.fields.map(field =>
                    field.id === fieldID
                        ? {
                              ...field,
                              value: newValue
                          }
                        : field
                )
            });
        },
        [entryFacade]
    );
    const handleTitleChange = useCallback(
        (newTitle: string) => {
            const titleField = entryFacade.fields.find(
                field =>
                    field.property === "title" && field.propertyType === EntryPropertyType.Property
            );
            handleFieldValueChange(titleField.id, newTitle);
        },
        [entryFacade, handleFieldValueChange]
    );
    const handleCancelEditConfirm = useCallback(() => {
        setShowConfirmCancel(false);
        navigation.goBack();
    }, [navigation]);
    const handleNavigateBack = useCallback(() => {
        if (changed) {
            setShowConfirmCancel(true);
        } else {
            handleCancelEditConfirm();
        }
    }, [changed, handleCancelEditConfirm]);
    const handleNewFieldAdd = useCallback(
        (
            name: string,
            value: string = "",
            valueType: EntryPropertyValueType = EntryPropertyValueType.Text
        ) => {
            const matchingField = entryFacade.fields.find(
                field =>
                    field.property === name && field.propertyType === EntryPropertyType.Property
            );
            if (matchingField) {
                notifyError(
                    "Field already exists",
                    `A field with the name '${name}' already exists. Please choose another name.`
                );
                return;
            }
            setPromptingNewField(false);
            const newField = createFieldDescriptor(null, name, EntryPropertyType.Property, name, {
                removeable: true,
                valueType
            });
            newField.value = value;
            setEntryFacade({
                ...entryFacade,
                fields: [...entryFacade.fields, newField]
            });
            setChanged(true);
        },
        [entryFacade]
    );
    const handleFieldRemove = useCallback(() => {
        const targetID = confirmDeleteFieldID;
        setConfirmDeleteFieldID(null);
        const newFacade = {
            ...entryFacade,
            fields: [...entryFacade.fields]
        };
        const fieldIndex = newFacade.fields.findIndex(field => field.id === targetID);
        newFacade.fields.splice(fieldIndex, 1);
        setEntryFacade(newFacade);
        setChanged(true);
    }, [confirmDeleteFieldID, entryFacade]);
    const handleFieldTypeSelect = useCallback(
        (typeIndex: IndexPath) => {
            const typeKey = Object.keys(FIELD_VALUE_TYPES)[typeIndex.row];
            const newFacade = {
                ...entryFacade,
                fields: entryFacade.fields.map(field =>
                    field.id === changeTypeFieldID ? { ...field } : field
                )
            };
            const targetField = entryFacade.fields.find(field => field.id === changeTypeFieldID);
            setEntryFacadePropertyValueType(
                newFacade,
                targetField.property,
                typeKey as EntryPropertyValueType
            );
            setEntryFacade(newFacade);
            setChanged(true);
            setChangeTypeFieldID(null);
        },
        [changeTypeFieldID, entryFacade]
    );
    const handleSave = useCallback(() => {
        setBusyState("Saving changes");
        const saveWork = entryID
            ? saveExistingEntryChanges(currentSource, entryID, entryFacade)
            : saveNewEntry(currentSource, groupID, entryFacade);
        saveWork
            .then(() => {
                setBusyState(null);
                notifySuccess("Saved entry", "Successfully saved changes");
                navigation.goBack();
            })
            .catch(err => {
                console.error(err);
                setBusyState(null);
                notifyError("Failed saving entry", err.message);
            });
    }, [currentSource, entryFacade, entryID, groupID, navigation]);
    const handleAddOTP = useCallback(
        (item: PromptItem) => {
            handleNewFieldAdd(
                item.title,
                item.slug, // URI
                EntryPropertyValueType.OTP
            );
            removePendingOTP(item.slug);
        },
        [handleNewFieldAdd, removePendingOTP]
    );
    useEffect(() => {
        if (entryFacade) return;
        if (!entryID) {
            setEntryFacade(
                createEntryFacade(null, {
                    type: entryType || EntryType.Login
                })
            );
        } else {
            setEntryFacade(getEntryFacade(currentSource, entryID));
        }
    }, [currentSource, entryFacade, entryID, entryType]);
    useEffect(() => {
        if (generatePasswordFieldID && lastPassword) {
            handleFieldValueChange(generatePasswordFieldID, lastPassword);
            setLastPassword("");
            setGeneratePasswordFieldID(null);
        }
    }, [lastPassword, generatePasswordFieldID, handleFieldValueChange, setLastPassword]);
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={handleNavigateBack} />;
    const SaveAction = () => (
        <TopNavigationAction disabled={!changed} icon={SaveIcon} onPress={handleSave} />
    );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation
                title={title}
                alignment="center"
                accessoryLeft={BackAction}
                accessoryRight={SaveAction}
            />
            <Divider />
            <Layout style={styles.bodyLayout}>
                <ScrollView style={styles.scrollView}>
                    <Input
                        accessoryLeft={TitleIcon}
                        autoCapitalize="sentences"
                        autoComplete="off"
                        onChangeText={handleTitleChange}
                        size="large"
                        value={title}
                    />
                    <Divider />
                    {entryFacade &&
                        entryFacade.fields.map((field: EntryFacadeField) =>
                            (field.property === "title" &&
                                field.propertyType === EntryPropertyType.Property) ||
                            field.propertyType === EntryPropertyType.Attribute ? null : (
                                <Layout key={field.id}>
                                    <Layout style={styles.fieldLayout}>
                                        <Text category="s1" style={styles.inputLabel}>
                                            {field.property}
                                        </Text>
                                        <Layout style={styles.inputContainerLayout}>
                                            <Input
                                                autoCapitalize="none"
                                                autoComplete="off"
                                                autoCorrect={false}
                                                onChangeText={(value: string) =>
                                                    handleFieldValueChange(field.id, value)
                                                }
                                                style={{
                                                    ...(field.valueType ===
                                                    EntryPropertyValueType.Password
                                                        ? styles.passwordInput
                                                        : {}),
                                                    ...styles.input
                                                }}
                                                value={field.value}
                                            />
                                            {field.valueType == EntryPropertyValueType.OTP && (
                                                <OTPScannerButton
                                                    onScanSuccess={data =>
                                                        handleFieldValueChange(field.id, data)
                                                    }
                                                />
                                            )}
                                            <FieldEditMenuButton
                                                entryID={entryID}
                                                items={[
                                                    {
                                                        disabled: !field.removeable,
                                                        text: `Change type (${field.valueType})`,
                                                        slug: "change-type",
                                                        icon: "swap-outline",
                                                        onSelect: () =>
                                                            setChangeTypeFieldID(field.id)
                                                    },
                                                    {
                                                        disabled: !field.removeable,
                                                        text: "Delete field",
                                                        slug: "delete-field",
                                                        icon: "trash-2-outline",
                                                        onSelect: () =>
                                                            setConfirmDeleteFieldID(field.id)
                                                    },
                                                    field.valueType ===
                                                        EntryPropertyValueType.Password && {
                                                        text: "Generate password",
                                                        slug: "generate-password",
                                                        icon: "lock-outline",
                                                        onSelect: () => {
                                                            setLastPassword("");
                                                            setGeneratePasswordFieldID(field.id);
                                                        }
                                                    }
                                                ]}
                                                navigation={navigation}
                                            />
                                        </Layout>
                                    </Layout>
                                    {changeTypeFieldID === field.id && (
                                        <Select
                                            label={`Change value type: ${field.property}`}
                                            selectedIndex={
                                                new IndexPath(
                                                    Object.keys(FIELD_VALUE_TYPES).indexOf(
                                                        field.valueType
                                                    )
                                                )
                                            }
                                            onSelect={index =>
                                                handleFieldTypeSelect(index as IndexPath)
                                            }
                                            value={
                                                field?.valueType
                                                    ? FIELD_VALUE_TYPES[field.valueType].title
                                                    : "Unknown type"
                                            }
                                        >
                                            {Object.keys(FIELD_VALUE_TYPES).map(type => (
                                                <SelectItem
                                                    key={FIELD_VALUE_TYPES[type].slug}
                                                    title={FIELD_VALUE_TYPES[type].title}
                                                />
                                            ))}
                                        </Select>
                                    )}
                                </Layout>
                            )
                        )}
                    <Divider />
                    <Button onPress={() => setPromptingNewField(true)} status="primary">
                        Add Field
                    </Button>
                    {pendingOTPs.length > 0 && (
                        <>
                            <Button
                                onPress={() => setPromptingPendingOTP(true)}
                                status="basic"
                                style={styles.additionalButton}
                            >
                                Add detected OTP
                            </Button>
                            <ItemsPrompt
                                items={pendingOTPItems}
                                onCancel={() => setPromptingPendingOTP(false)}
                                onSelect={(item: PromptItem) => handleAddOTP(item)}
                                visible={promptingPendingOTP}
                            />
                        </>
                    )}
                </ScrollView>
            </Layout>
            <ConfirmPrompt
                cancelable
                onCancel={() => setShowConfirmCancel(false)}
                onConfirm={handleCancelEditConfirm}
                prompt="Discard changes and return to entry details?"
                title="Cancel Editing"
                visible={showConfirmCancel}
            />
            <ConfirmPrompt
                cancelable
                onCancel={() => setConfirmDeleteFieldID(null)}
                onConfirm={handleFieldRemove}
                prompt="Delete this entry field?"
                title="Delete Field"
                visible={!!confirmDeleteFieldID}
            />
            <TextPrompt
                cancelable
                onCancel={() => setPromptingNewField(false)}
                onSubmit={handleNewFieldAdd}
                prompt="New field name"
                visible={promptingNewField}
            />
        </SafeAreaView>
    );
}
