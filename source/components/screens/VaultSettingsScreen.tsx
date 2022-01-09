import React, { useCallback, useMemo, useState } from "react";
import { PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Card, IndexPath, Layout, Select, SelectItem, Text, Toggle } from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import ms from "ms";
import { CURRENT_SOURCE } from "../../state/vault";
import { TextPrompt } from "../prompts/TextPrompt";
import { useTabFocusState } from "../../hooks/vaultTab";
import { useBiometricsAvailable, useBiometricsEnabledForSource } from "../../hooks/biometrics";
import { useVaultConfiguration } from "../../hooks/config";
import { notifyError, notifySuccess } from "../../library/notifications";
import { setBusyState } from "../../services/busyState";
import { AutoFillBridge } from "../../services/autofillBridge";
import { authenticateBiometrics, disableBiometicsForSource, enableBiometricsForSource } from "../../services/biometrics";
import { processEasyAccessOTPsForSource, verifySourcePassword } from "../../services/buttercup";
import { updateVaultConfig, VaultConfiguration } from "../../services/config";
import { removeCredentialsForVault, storeAutofillCredentials } from "../../services/intermediateCredentials";
import { VAULT_AUTOLOCK_OPTIONS } from "../../symbols";

const styles = StyleSheet.create({
    longLayout: {
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start"
    },
    longLayoutText: {
        marginBottom: 8
    },
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
    const vaultConfig = useVaultConfiguration(currentSourceState.get());
    // **
    // ** Config items
    // **
    const handleUpdateConfig = useCallback(async (config: VaultConfiguration) => {
        try {
            await updateVaultConfig(currentSourceState.get(), {
                ...config
            });
        } catch (err) {
            console.error(err);
            notifyError("Failed updating configuration", err.message);
        }
    }, [currentSourceState.get()]);
    const vaultAutoLockCurrentIndex = useMemo<number>(
        () => {
            const index = VAULT_AUTOLOCK_OPTIONS.findIndex(
                item => (item.delay && ms(item.delay) === vaultConfig.autoLockTime) || (!item.enabled && !vaultConfig.autoLockEnabled)
            );
            return index === -1 ? 0 : index;
        },
        [vaultConfig]
    );
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
    // ** Easy OTPs
    // **
    const handleEasyOTPsActivation = useCallback(async (activated: boolean) => {
        try {
            await processEasyAccessOTPsForSource(currentSourceState.get(), activated);
        } catch (err) {
            console.error(err);
            notifyError("Failed apply OTP setting", err.message);
        }
    }, [currentSourceState.get()]);
    const handleEasyOTPsChange = useCallback((isChecked: boolean) => {
        handleEasyOTPsActivation(isChecked)
            .then(() => {
                handleUpdateConfig({
                    ...vaultConfig,
                    otpAlwaysAvailable: isChecked
                });
            })
            .catch(err => {
                console.error(err);
                notifyError("Failed modifying OTP setting", err.message);
            });
    }, [handleEasyOTPsActivation, vaultConfig]);
    // **
    // ** Autofill
    // **
    const handleAutofillActivation = useCallback(async (activated: boolean): Promise<void> => {
        if (activated) {
            if (Platform.OS === "android") {
                const grantedStatus = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                ]);
                const writeGranted = grantedStatus["android.permission.WRITE_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED;
                const readGranted = grantedStatus["android.permission.READ_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED;
                if (!writeGranted || !readGranted) {
                    notifyError("Permissions not granted", "Extra permissions required before Auto-fill can be enabled");
                    return;
                }
            }
            // Prompt the user to set Buttercup as AutoFill provider in system settings
            // This is likely NOT the correct place to trigger this - it should be in response to some UI
            // that explicitly advises what autofill is and why they should enable it etc.
            const isAutofillProviderSet = await AutoFillBridge.getAutoFillSystemStatus();
            if (!isAutofillProviderSet) {
                await AutoFillBridge.openAutoFillSystemSettings();
            }
            await storeAutofillCredentials(currentSourceState.get(), true);
        } else {
            await removeCredentialsForVault(currentSourceState.get());
        }
    }, [currentSourceState.get()]);
    const handleAutofillEnableChange = useCallback((isChecked: boolean) => {
        handleAutofillActivation(isChecked)
            .then(() => {
                handleUpdateConfig({
                    ...vaultConfig,
                    autofill: isChecked
                });
            })
            .catch(err => {
                console.error(err);
                notifyError("Failed modifying autofill setting", err.message);
            });
    }, [handleAutofillActivation, vaultConfig]);
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
                                title="Password Auto-fill"
                                subtitle="Automatically fill login forms/prompts"
                            />
                        )}
                        style={styles.settingCard}
                    >
                        <Layout style={styles.switchLayout}>
                            <Text style={styles.switchLayoutText}>
                                Enable automatic login form filling using this vault.
                            </Text>
                            <Toggle
                                checked={!AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL ? false : vaultConfig.autofill}
                                disabled={!AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL}
                                onChange={handleAutofillEnableChange}
                            >
                                {vaultConfig.autofill ? "Enabled" : "Disabled"}
                            </Toggle>
                        </Layout>
                    </Card>
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
                    <Card
                        header={props => (
                            <VaultSettingHeader
                                {...props}
                                title="Auto Lock"
                                subtitle="Automatic vault locking after delay"
                            />
                        )}
                        style={styles.settingCard}
                    >
                        <Layout style={styles.longLayout}>
                            <Text style={styles.longLayoutText}>
                                Set current vault automatic lock time.
                            </Text>
                            <Select
                                label="Vault auto lock time"
                                selectedIndex={new IndexPath(vaultAutoLockCurrentIndex)}
                                onSelect={(index: IndexPath) => handleUpdateConfig({
                                    ...vaultConfig,
                                    autoLockEnabled: VAULT_AUTOLOCK_OPTIONS[index.row].enabled,
                                    autoLockTime: VAULT_AUTOLOCK_OPTIONS[index.row].enabled
                                        ? ms(VAULT_AUTOLOCK_OPTIONS[index.row].delay)
                                        : null
                                })}
                                value={VAULT_AUTOLOCK_OPTIONS[vaultAutoLockCurrentIndex].title}
                            >
                                {VAULT_AUTOLOCK_OPTIONS.map(option => (
                                    <SelectItem
                                        key={option.title}
                                        title={option.title}
                                    />
                                ))}
                            </Select>
                        </Layout>
                    </Card>
                    <Card
                        header={props => (
                            <VaultSettingHeader
                                {...props}
                                title="Easy OTP Codes"
                                subtitle="Show OTPs from this vault on the home screen"
                            />
                        )}
                        style={styles.settingCard}
                    >
                        <Layout style={styles.switchLayout}>
                            <Text style={styles.switchLayoutText}>
                                Show all available OTP codes from this vault on the home screen.
                            </Text>
                            <Toggle
                                checked={vaultConfig.otpAlwaysAvailable}
                                onChange={handleEasyOTPsChange}
                            >
                                {vaultConfig.otpAlwaysAvailable ? "Enabled" : "Disabled"}
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
