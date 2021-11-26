import React, { useCallback, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
    Divider,
    Icon,
    Layout,
    Text,
    TopNavigation,
    TopNavigationAction,
    useTheme
} from "@ui-kitten/components";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { TypeChooser } from "./add-vault/TypeChooser";
import { ConnectionDetails } from "./add-vault/ConnectionDetails";
import { VaultChooser } from "./add-vault/VaultChooser";
import { AddVaultConfirmation } from "./add-vault/AddVaultConfirmation";
import { setBusyState } from "../../services/busyState";
import { addVault } from "../../services/buttercup";
import { VAULT_TYPES } from "../../library/buttercup";
import { notifyError, notifySuccess } from "../../library/notifications";
import { DatasourceConfig, VaultChooserItem } from "../../types";

interface TemporaryDatasourceConfig {
    type: null | string;
    [key: string]: any;
}

const BackIcon = props => <Icon {...props} name="arrow-back" />;

const styles = StyleSheet.create({
    confirmationLayout: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    connectionDetailsLayout: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        paddingHorizontal: 18
    },
    connectionDetailsLayoutHeading: {
        width: "100%",
        textAlign: "center",
        marginBottom: 20,
        paddingTop: 4,
        paddingBottom: 8
    },
    previousBtnTextStyle: {
        color: "transparent",
        display: "none"
    },
    vaultChooserLayout: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    vaultTypeLayout: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        paddingHorizontal: 18
    },
    vaultTypeLayoutHeading: {
        width: "100%",
        textAlign: "center",
        paddingTop: 4,
        paddingBottom: 8
    }
});

export function AddVaultScreen({ navigation }) {
    const theme = useTheme();
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    const [vaultType, setVaultType] = useState<string>(null);
    const [chosenVaultPath, setChosenVaultPath] = useState<VaultChooserItem>(null);
    const [connectionDetailsValid, setConnectionDetailsValid] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [allComplete, setAllComplete] = useState<boolean>(false);
    const [datasourceConfig, setDatasourceConfig] = useState<DatasourceConfig | TemporaryDatasourceConfig>({
        type: null
    });
    const [vaultPassword, setVaultPassword] = useState<string>("");
    const handleVaultTypeSelection = useCallback((type: string) => {
        setVaultType(type);
        setDatasourceConfig({
            ...datasourceConfig,
            type
        });
    }, [datasourceConfig]);
    const handleConnectionDetailsUpdate = useCallback((isValid: boolean, dsConfig: DatasourceConfig) => {
        setConnectionDetailsValid(isValid);
        setDatasourceConfig({
            ...datasourceConfig,
            ...dsConfig
        });
    }, [datasourceConfig]);
    const handleConfirmationPasswordUpdate = useCallback((password: string) => {
        setVaultPassword(password);
    }, []);
    const handleSubmit = useCallback(() => {
        setSubmitting(true);
        setAllComplete(true);
        setBusyState("Adding Vault");
        addVault(vaultType, datasourceConfig as DatasourceConfig, chosenVaultPath, vaultPassword)
            .then(() => {
                setBusyState(null);
                const vaultTypeName = VAULT_TYPES[vaultType].title;
                notifySuccess("Successfully added vault", `${vaultTypeName} vault was added and unlocked`);
                navigateBack();
            })
            .catch(err => {
                setBusyState(null);
                setSubmitting(false);
                setAllComplete(false);
                console.warn(err);
                notifyError("Failed adding vault", err.message);
            });
    }, [chosenVaultPath, datasourceConfig, vaultPassword, vaultType]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation title="Add Vault" alignment="center" accessoryLeft={BackAction} />
            <Divider />
            <Layout style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
                <ProgressSteps
                    activeLabelColor={theme["color-info-default"]}
                    activeStepIconBorderColor={theme["color-primary-active"]}
                    activeStepNumColor={theme["color-info-default"]}
                    disabledStepIconColor={theme["background-basic-color-2"]}
                    disabledStepNumColor={theme["color-primary-disabled"]}
                    isComplete={allComplete}
                    labelColor={theme["color-info-disabled"]}
                    progressBarColor={theme["background-basic-color-3"]}
                >
                    <ProgressStep
                        label="Choose Type"
                        nextBtnDisabled={!vaultType}
                        previousBtnDisabled
                        previousBtnTextStyle={styles.previousBtnTextStyle}
                    >
                        <Layout style={styles.vaultTypeLayout}>
                            <Text style={styles.vaultTypeLayoutHeading} category="s1">Vault Type</Text>
                            <TypeChooser onSelectType={handleVaultTypeSelection} />
                        </Layout>
                    </ProgressStep>
                    <ProgressStep
                        label="Connect"
                        nextBtnDisabled={!connectionDetailsValid}
                        previousBtnDisabled
                        previousBtnTextStyle={styles.previousBtnTextStyle}
                    >
                        <Layout style={styles.connectionDetailsLayout}>
                            {vaultType && (
                                <>
                                    <Text style={styles.connectionDetailsLayoutHeading} category="s1">Connection</Text>
                                    <ConnectionDetails
                                        onCanContinue={handleConnectionDetailsUpdate}
                                        vaultType={vaultType}
                                    />
                                </>
                            )}
                        </Layout>
                    </ProgressStep>
                    <ProgressStep
                        label="Select Vault"
                        nextBtnDisabled={!chosenVaultPath}
                        previousBtnDisabled
                        previousBtnTextStyle={styles.previousBtnTextStyle}
                    >
                        <Layout level="2" style={styles.vaultChooserLayout}>
                            <VaultChooser
                                onSelectVault={setChosenVaultPath}
                            />
                        </Layout>
                    </ProgressStep>
                    <ProgressStep
                        label="Confirm"
                        nextBtnDisabled={submitting || !vaultPassword}
                        onSubmit={handleSubmit}
                        previousBtnDisabled
                        previousBtnTextStyle={styles.previousBtnTextStyle}
                    >
                        <Layout style={styles.confirmationLayout}>
                            <AddVaultConfirmation
                                disabled={submitting}
                                onUpdatePassword={handleConfirmationPasswordUpdate}
                                type={vaultType}
                                vaultPath={chosenVaultPath}
                            />
                        </Layout>
                    </ProgressStep>
                </ProgressSteps>
            </Layout>
        </SafeAreaView>
    );
}
