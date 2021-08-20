import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
    Button,
    Input,
    Layout
} from "@ui-kitten/components";
import { setBusyState } from "../../../services/busyState";
import { disableCurrentInterface, prepareWebDAVInterface } from "../../../services/fileBrowser";
import { webdavConnectionValid } from "../../../library/webdav";
import { notifyError, notifySuccess } from "../../../library/notifications";
import { DatasourceConfig } from "../../../types";

interface ConnectionDetailsProps {
    onCanContinue: (canContinue: boolean, config: DatasourceConfig) => void;
    vaultType: string;
}

const VALID_URL = /^https?:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+/i;

const styles = StyleSheet.create({
    input: {
        width: "100%"
    },
    inputLayout: {
        marginBottom: 16
    }
});

export function ConnectionDetails(props: ConnectionDetailsProps) {
    const { onCanContinue, vaultType } = props;
    if (vaultType === "webdav") {
        const [url, setURL] = useState<string>("");
        const [username, setUsername] = useState<string>("");
        const [password, setPassword] = useState<string>("");
        const [urlValid, setURLValid] = useState<boolean>(false);
        const [connecting, setConnecting] = useState<boolean>(false);
        const handleConnectionTest = useCallback(() => {
            setConnecting(true);
            setBusyState("Testing connection");
            disableCurrentInterface();
            webdavConnectionValid(url, username, password).then(([isValid, errMsg]) => {
                setBusyState(null);
                onCanContinue(isValid, {
                    endpoint: url,
                    username,
                    password,
                    type: vaultType
                });
                if (isValid) {
                    notifySuccess("Connection succeeded", "WebDAV connection test succeeded");
                    prepareWebDAVInterface(url, username, password);
                } else {
                    notifyError("Connection failed", "WebDAV connection test failed");
                    setConnecting(false);
                }
            });
        }, [url, username, password, vaultType]);
        useEffect(() => {
            setURLValid(VALID_URL.test(url));
        }, [url]);
        return (
            <>
                <Layout style={styles.inputLayout}>
                    <Input
                        autoCapitalize="none"
                        autoCompleteType="off"
                        autoCorrect={false}
                        disabled={connecting}
                        label="WebDAV URL"
                        onChangeText={setURL}
                        placeholder="https://..."
                        style={styles.input}
                        value={url}
                    />
                </Layout>
                <Layout style={styles.inputLayout}>
                    <Input
                        autoCapitalize="none"
                        autoCompleteType="username"
                        autoCorrect={false}
                        disabled={connecting}
                        label="Username"
                        onChangeText={setUsername}
                        placeholder="Account username"
                        style={styles.input}
                        value={username}
                    />
                </Layout>
                <Layout style={styles.inputLayout}>
                    <Input
                        autoCapitalize="none"
                        autoCompleteType="password"
                        disabled={connecting}
                        label="Password"
                        onChangeText={setPassword}
                        placeholder="Account password"
                        secureTextEntry
                        style={styles.input}
                        value={password}
                    />
                </Layout>
                <Button
                    disabled={!urlValid || connecting}
                    onPress={handleConnectionTest}
                >
                    Connect
                </Button>
            </>
        );
    }
    return null;
}
