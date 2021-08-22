import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
    Button,
    Icon,
    Input,
    Layout,
    List,
    ListItem,
    Text
} from "@ui-kitten/components";
import { VAULT_TYPES } from "../../../library/buttercup";
import { VaultChooserPath } from "../../../types";

interface AddVaultConfirmationProps {
    disabled?: boolean;
    onUpdate: (password: string) => void;
    type: string;
    vaultPath: VaultChooserPath;
}

interface ConfirmationData {
    property: string;
    value: string;
    icon: string;
}

interface ConfirmationItem {
    item: ConfirmationData;
}

const getIcon = (iconName: string) => props => <Icon {...props} name={iconName} />;
const styles = StyleSheet.create({
    contentContainer: {},
    input: {
        width: "100%"
    },
    inputLayout: {
        marginVertical: 4
    },
    listContainer: {}
});

function renderItem(props: ConfirmationItem) {
    const { item } = props;
    return (
        <ListItem
            title={item.property}
            accessoryLeft={getIcon(item.icon)}
            accessoryRight={() => (
                <Text>{item.value}</Text>
            )}
        />
    );
}

export function AddVaultConfirmation(props: AddVaultConfirmationProps) {
    const { disabled = false, onUpdate, type, vaultPath } = props;
    const name = vaultPath.name || vaultPath.identifier;
    const isNew = !vaultPath.identifier;
    const typeName = useMemo(() => VAULT_TYPES[type].title, [type]);
    const [password, setPassword] = useState<string>("");
    useEffect(() => {
        onUpdate(password);
    }, [onUpdate, password]);
    const data: Array<ConfirmationData> = useMemo(() => [
        {
            property: "Vault Name",
            value: name,
            icon: "archive-outline"
        },
        {
            property: "Type",
            value: typeName,
            icon: "wifi-outline"
        },
        {
            property: "Create New",
            value: isNew ? "Yes" : "No",
            icon: "plus-outline"
        }
    ], [name]);
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <List
                    style={styles.listContainer}
                    contentContainerStyle={styles.contentContainer}
                    data={data}
                    renderItem={renderItem}
                    scrollEnabled={false}
                />
                <Layout style={styles.inputLayout}>
                    <Input
                        autoCapitalize="none"
                        autoCompleteType="password"
                        disabled={disabled}
                        label="Vault Password"
                        onChangeText={setPassword}
                        placeholder="Account password"
                        secureTextEntry
                        style={styles.input}
                        value={password}
                    />
                </Layout>
            </SafeAreaView>
        </>
    );
}