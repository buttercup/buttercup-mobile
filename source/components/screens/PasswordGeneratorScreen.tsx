import { randomBytes } from "react-native-randombytes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useState as useHookState } from "@hookstate/core";
import Clipboard from "@react-native-community/clipboard";
import Slider from "@react-native-community/slider";
import {
    Button,
    Card,
    CheckBox,
    Divider,
    Icon,
    Input,
    Layout,
    Radio,
    RadioGroup,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import { notifySuccess } from "../../library/notifications";
import { GeneratorMode, GENERATOR_MODE, LAST_PASSWORD } from "../../state/generator";

const MAX_RANDOM_INT = 4294967295;
const { MONO_FONT } = Platform.select({
    ios: {
        MONO_FONT: "Courier New"
    },
    android: {
        MONO_FONT: "monospace"
    }
});
const OPTIONS = [
    { key: "uppercase", text: "Uppercase", initial: true, characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
    { key: "lowercase", text: "Lowercase", initial: true, characters: "abcdefghijklmnopqrstuvwxyz" },
    { key: "digits", text: "Digits", initial: true, characters: "0123456789" },
    { key: "space", text: "Space", initial: false, characters: " " },
    { key: "underscoreDash", text: "Underscore / Dash", initial: true, characters: "_-" },
    { key: "symbols", text: "Symbols", initial: true, characters: "~!@#$%^&*()+=[]{};:,.<>?|" }
];

const CloseIcon = props => <Icon {...props} name="close-square-outline" />;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    controlButton: {
        marginLeft: 3
    },
    controlGroup: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 6
    },
    fullLength: {
        width: "100%"
    },
    lengthContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    lengthValue: {},
    optionCheckbox: {
        marginBottom: 6
    },
    passwordInput: {
        fontFamily: MONO_FONT,
        fontSize: 18,
        fontWeight: "500"
    },
    scrollInner: {
        paddingBottom: 32
    },
    scrollView: {
        paddingVertical: 12,
        paddingHorizontal: 24
    },
    sectionTitle: {
        marginTop: 12,
        marginBottom: 8
    }
});

async function generateRandomBytes(count: number): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        randomBytes(count, (err: Error, bytes: Buffer) => {
            if (err) {
                return reject(err);
            }
            resolve(bytes);
        });
    });
}

async function generateRandomPassword(selectedOptions: Array<string>, length: number): Promise<string> {
    if (length <= 0) return "";
    const chars = OPTIONS.reduce(
        (output: string, option) => selectedOptions.includes(option.key) ? `${output}${option.characters}` : output,
        ""
    );
    const output: Array<string> = [];
    for (let i = 0; i < length; i += 1) {
        const randBytes = await generateRandomBytes(4);
        const rand = parseInt(randBytes.toString("hex"), 16) / MAX_RANDOM_INT;
        const charIndex = Math.floor(rand * chars.length);
        output.push(chars[charIndex]);
    }
    return output.join("");
}

export function PasswordGeneratorScreen({ navigation }) {
    const generatorModeState = useHookState(GENERATOR_MODE);
    const lastPasswordState = useHookState(LAST_PASSWORD);
    const [currentPassword, setCurrentPassword] = useState("th4e_-bqE@?`[dJp5K:c3yn]d;");
    const [selectedModeIndex, setSelectedModeIndex] = useState(0);
    const initialCheckedOptions = useMemo(() => OPTIONS.reduce(
        (output, option) => option.initial ? [...output, option.key] : output,
        []
    ), []);
    const [checkedOptions, setCheckedOptions] = useState(initialCheckedOptions);
    const [passwordLength, setPasswordLength] = useState(12);
    const [passwordDisplayLength, setPasswordDisplayLength] = useState(12);
    const toggleOption = useCallback((optionKey: string) => {
        if (checkedOptions.includes(optionKey)) {
            setCheckedOptions(checkedOptions.filter(opt => opt !== optionKey));
        } else {
            setCheckedOptions([
                ...checkedOptions,
                optionKey
            ]);
        }
    }, [checkedOptions]);
    const generatePassword = useCallback(async () => {
        const randPass = await generateRandomPassword(checkedOptions, passwordLength);
        setCurrentPassword(randPass);
    }, [selectedModeIndex, checkedOptions, passwordLength]);
    const navigateBack = () => {
        generatorModeState.set(GeneratorMode.Standalone);
        navigation.goBack();
    };
    const handleGeneratePasswordPress = useCallback(() => {
        generatePassword().catch(err => {
            console.error(err);
        });
    }, [generatePassword]);
    const handleCopyPasswordPress = useCallback(() => {
        Clipboard.setString(currentPassword);
        notifySuccess("Password Copied", `The generated password was copied`);
        navigateBack();
    }, [currentPassword, lastPasswordState, navigateBack]);
    const handleSubmitPasswordPress = useCallback(() => {
        lastPasswordState.set(currentPassword);
        navigateBack();
    }, [currentPassword, navigateBack]);
    useEffect(() => {
        generatePassword().catch(err => {
            console.error(err);
        });
    }, [generatePassword]);
    const BackAction = () => <TopNavigationAction icon={CloseIcon} onPress={navigateBack} />;
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation title="Generator" alignment="center" accessoryRight={BackAction} />
            <Divider />
            <Layout level="2" style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.scrollInner}>
                        <Text category="s1" style={styles.sectionTitle}>Select Mode</Text>
                        <Card activeOpacity={1}>
                            <RadioGroup
                                onChange={index => setSelectedModeIndex(index)}
                                selectedIndex={selectedModeIndex}
                            >
                                <Radio>Characters</Radio>
                                <Radio disabled>Words</Radio>
                            </RadioGroup>
                        </Card>
                        <Text category="s1" style={styles.sectionTitle}>Options</Text>
                        <Card activeOpacity={1}>
                            {OPTIONS.map(option => (
                                <CheckBox
                                    checked={checkedOptions.includes(option.key)}
                                    key={option.key}
                                    onChange={() => toggleOption(option.key)}
                                    style={styles.optionCheckbox}
                                >
                                    {option.text}
                                </CheckBox>
                            ))}
                        </Card>
                        <Text category="s1" style={styles.sectionTitle}>Length</Text>
                        <Card activeOpacity={1}>
                            <View style={styles.lengthContainer}>
                                <Slider
                                    style={{width: "85%", height: 40}}
                                    minimumValue={4}
                                    maximumValue={32}
                                    onValueChange={setPasswordDisplayLength}
                                    onSlidingComplete={setPasswordLength}
                                    step={1}
                                    value={passwordLength}
                                    minimumTrackTintColor="#FFFFFF"
                                    maximumTrackTintColor="#000000"
                                />
                                <Text style={styles.lengthValue}>{passwordDisplayLength}</Text>
                            </View>
                        </Card>
                        <Text category="s1" style={styles.sectionTitle}>Output</Text>
                        <Card activeOpacity={1} style={styles.fullLength}>
                            <Input
                                autoCapitalize="none"
                                dataDetectorTypes="none"
                                editable={false}
                                multiline
                                selectTextOnFocus
                                spellCheck={false}
                                size="large"
                                textAlignVertical="top"
                                textBreakStrategy="balanced"
                                textStyle={styles.passwordInput}
                                value={currentPassword}
                            />
                        </Card>
                        <Layout level="2" style={styles.controlGroup}>
                            <Button status="warning" size="large" style={styles.controlButton} onPress={handleGeneratePasswordPress}>Generate</Button>
                            {generatorModeState.get() === GeneratorMode.Standalone && (
                                <Button size="large" style={styles.controlButton} onPress={handleCopyPasswordPress}>Copy</Button>
                            )}
                            {generatorModeState.get() === GeneratorMode.EntryProperty && (
                                <Button size="large" style={styles.controlButton} onPress={handleSubmitPasswordPress}>Use</Button>
                            )}
                        </Layout>
                    </View>
                </ScrollView>
            </Layout>
        </SafeAreaView>
    );
}
