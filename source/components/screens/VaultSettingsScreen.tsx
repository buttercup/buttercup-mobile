import React, { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Card, Layout, Text, Toggle } from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import { CURRENT_SOURCE } from "../../state/vault";
import { useTabFocusState } from "../../hooks/vaultTab";
import { useBiometricsAvailable, useBiometricsEnabledForSource } from "../../hooks/biometrics";
import { notifyError, notifySuccess } from "../../library/notifications";
import { setBusyState } from "../../services/busyState";
import { authenticateBiometrics, disableBiometicsForSource, enableBiometricsForSource } from "../../services/biometrics";
import { verifySourcePassword } from "../../services/buttercup";
import { TextPrompt } from "../prompts/TextPrompt";

const styles = StyleSheet.create({
    settingCard: {
        marginHorizontal: 10,
        marginTop: 6,
        marginBottom: 6
    },
    settingHeaderView: {
        padding: 10
    },
    switchLayout: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between"
    },
    switchLayoutText: {
        flex: 1
    }
});

function VaultSettingHeader({ subtitle = null, title }) {
    return (
        <View style={styles.settingHeaderView}>
            <Text category="h6">{title}</Text>
            {subtitle && (
                <Text category="s1">{subtitle}</Text>
            )}
        </View>
    );
}

export function VaultSettingsScreen({ navigation }) {
    useTabFocusState("settings", "Vault Settings");
    const currentSourceState = useHookState(CURRENT_SOURCE);
    // **
    // ** Biometrics
    // **
    const biometricsAvailable = useBiometricsAvailable();
    const biometricsEnabled = useBiometricsEnabledForSource(currentSourceState.get());
    const [verifyingBiometricsPassword, setVerifyingBiometricsPassword] = useState(false);
    const handleDisablingBiometrics = useCallback(() => {
        setBusyState("Saving biometrics state");
        disableBiometicsForSource(currentSourceState.get())
            .then(() => {
                setBusyState(null);
                notifySuccess("Biometrics disabled", "Successfully disabled biometrics for the current vault");
            })
            .catch(err => {
                setBusyState(null);
                console.error(err);
                notifyError("Failed disabling biometrics", err.message);
            });
    }, [currentSourceState.get()]);
    const handleEnablingBiometrics = useCallback((vaultPassword: string) => {
        setVerifyingBiometricsPassword(false);
        setBusyState("Verifying vault password");
        verifySourcePassword(currentSourceState.get(), vaultPassword)
            .then(passwordValid => {
                if (!passwordValid) {
                    throw new Error("Vault password invalid");
                }
                setBusyState("Saving biometrics state");
                return enableBiometricsForSource(currentSourceState.get(), vaultPassword)
            })
            .then(() => {
                setBusyState(null);
                notifySuccess("Biometrics enabled", "Successfully enabled biometrics for the current vault");
            })
            .catch(err => {
                setBusyState(null);
                console.error(err);
                notifyError("Failed enabling biometrics", err.message);
            });
    }, [currentSourceState.get()]);
    const handleBiometricsAuthentication = useCallback(() => {
        authenticateBiometrics()
            .then(succeeded => {
                if (!succeeded) {
                    throw new Error("Biometrics not available");
                }
                setVerifyingBiometricsPassword(true);
            })
            .catch(err => {
                console.error(err);
                notifyError("Failed validating biometrics", err.message);
            });
    }, []);
    const handleBiometricsStateChange = useCallback((isChecked: boolean) => {
        if (isChecked) {
            handleBiometricsAuthentication();
        } else {
            handleDisablingBiometrics();
        }
    }, [handleDisablingBiometrics]);
    // **
    // ** Render
    // **
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1 }} level="2">
                <ScrollView>
                    <Card
                        header={props => (
                            <VaultSettingHeader
                                {...props}
                                title="Biometric Unlock"
                                subtitle="Touch/Face vault unlocking"
                            />
                        )}
                        style={styles.settingCard}
                    >
                        <Layout style={styles.switchLayout}>
                            <Text style={styles.switchLayoutText}>
                                Enable touch/face unlock for this vault.
                            </Text>
                            <Toggle
                                checked={biometricsEnabled}
                                disabled={!biometricsAvailable}
                                onChange={handleBiometricsStateChange}
                            >
                                {biometricsAvailable ? biometricsEnabled ? "Enabled" : "Disabled" : "Unavailable"}
                            </Toggle>
                        </Layout>
                    </Card>
                </ScrollView>
            </Layout>
            <TextPrompt
                cancelable
                onCancel={() => setVerifyingBiometricsPassword(false)}
                onSubmit={handleEnablingBiometrics}
                password
                prompt="Verify password"
                submitText="Verify"
                visible={verifyingBiometricsPassword}
            />
        </SafeAreaView>
    );
}