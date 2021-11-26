import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
    Icon,
    Input,
    Layout,
    List,
    ListItem,
    Text
} from "@ui-kitten/components";
import { VAULT_TYPES } from "../../../library/buttercup";
import { VaultChooserItem } from "../../../types";

interface AddVaultConfirmationProps {
    disabled?: boolean;
    onUpdatePassword: (password: string) => void;
    type: string;
    vaultPath: VaultChooserItem;
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
    const { disabled = false, onUpdatePassword, type, vaultPath } = props;
    const name = (vaultPath.name || vaultPath.identifier) as string;
    const isNew = !vaultPath.identifier;
    const typeName = useMemo(() => VAULT_TYPES[type].title, [type]);
    const [password, setPassword] = useState<string>("");
    useEffect(() => {
        onUpdatePassword(password);
    }, [onUpdatePassword, password]);
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
                        placeholder="Enter password..."
                        secureTextEntry
                        style={styles.input}
                        value={password}
                    />
                </Layout>
            </SafeAreaView>
        </>
    );
}
