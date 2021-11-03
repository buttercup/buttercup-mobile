import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Linking, StyleSheet } from "react-native";
import {
    Button,
    Icon,
    Input,
    Layout,
    Text
} from "@ui-kitten/components";
import { useDropboxToken } from "../../../hooks/dropbox";
import { useGoogleToken } from "../../../hooks/google";
import { setBusyState } from "../../../services/busyState";
import { disableCurrentInterface, prepareWebDAVInterface } from "../../../services/fileBrowser";
import { generateAuthorisationURL as generateDropboxAuthorisationURL } from "../../../services/dropbox";
import { generateAuthorisationURL as generateGoogleDriveAuthorisationURL } from "../../../services/google";
import { webdavConnectionValid } from "../../../library/webdav";
import { notifyError, notifySuccess } from "../../../library/notifications";
import { DatasourceConfig } from "../../../types";

interface ConnectionDetailsProps {
    onCanContinue: (canContinue: boolean, config: DatasourceConfig) => void;
    vaultType: string;
}

enum DropboxState {
    Connected = 2,
    Connecting = 1,
    Idle = 0
}

enum GoogleState {
    Connected = 2,
    Connecting = 1,
    Idle = 0
}

const VALID_URL = /^https?:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+/i;

const styles = StyleSheet.create({
    input: {
        width: "100%"
    },
    inputLayout: {
        marginBottom: 16
    },
    status: {
        width: "100%",
        marginBottom: 16,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
    }
});

export function ConnectionDetails(props: ConnectionDetailsProps) {
    const { vaultType } = props;
    if (vaultType === "webdav") {
        return (
            <WebDAVConnection {...props} />
        );
    } else if (vaultType === "dropbox") {
        return (
            <DropboxConnection {...props} />
        );
    } else if (vaultType === "googledrive") {
        return (
            <GoogleDriveConnection {...props} />
        )
    }
    return null;
}

function DropboxConnection(props: ConnectionDetailsProps) {
    const { onCanContinue, vaultType } = props;
    const [status, setStatus] = useState<DropboxState>(DropboxState.Idle);
    const dropboxToken = useDropboxToken();
    const dropboxAuthURL: string = useMemo(generateDropboxAuthorisationURL, []);
    const handleAuthorisation = useCallback(() => {
        Linking.openURL(dropboxAuthURL);
        setStatus(DropboxState.Connecting);
    }, [dropboxAuthURL]);
    useEffect(() => {
        if (dropboxToken) {
            setStatus(DropboxState.Connected);
            onCanContinue(true, {
                token: dropboxToken,
                type: vaultType
            });
        }
    }, [dropboxToken]);
    return (
        <>
            <Layout style={styles.status}>
                <Text category="h6">Status:</Text>
                {status === DropboxState.Idle && (
                    <Text category="s1" status="danger">Not Connected</Text>
                )}
                {status === DropboxState.Connecting && (
                    <Text category="s1" status="warning">Connecting</Text>
                )}
                {status === DropboxState.Connected && (
                    <Text category="s1" status="success">Connected</Text>
                )}
            </Layout>
            <Button
                accessoryRight={(
                    <Icon name="flash" />
                )}
                disabled={status !== DropboxState.Idle}
                onPress={handleAuthorisation}
            >
                Connect Dropbox Account
            </Button>
        </>
    );
}

function GoogleDriveConnection(props: ConnectionDetailsProps) {
    const { onCanContinue, vaultType } = props;
    const [status, setStatus] = useState<GoogleState>(GoogleState.Idle);
    const googleDriveToken = useGoogleToken();
    const googleAuthURL: string = useMemo(generateGoogleDriveAuthorisationURL, []);
    const handleAuthorisation = useCallback(() => {
        Linking.openURL(googleAuthURL);
        setStatus(GoogleState.Connecting);
    }, [googleAuthURL]);
    useEffect(() => {
        if (googleDriveToken) {
            setStatus(GoogleState.Connected);
            onCanContinue(true, {
                token: googleDriveToken.accessToken,
                refreshToken: googleDriveToken.refreshToken,
                type: vaultType
            });
        }
    }, [googleDriveToken]);
    return (
        <>
            <Layout style={styles.status}>
                <Text category="h6">Status:</Text>
                {status === GoogleState.Idle && (
                    <Text category="s1" status="danger">Not Connected</Text>
                )}
                {status === GoogleState.Connecting && (
                    <Text category="s1" status="warning">Connecting</Text>
                )}
                {status === GoogleState.Connected && (
                    <Text category="s1" status="success">Connected</Text>
                )}
            </Layout>
            <Button
                accessoryRight={(
                    <Icon name="flash" />
                )}
                disabled={status !== GoogleState.Idle}
                onPress={handleAuthorisation}
            >
                Connect Google Drive Account
            </Button>
        </>
    );
}

function WebDAVConnection(props: ConnectionDetailsProps) {
    const { onCanContinue, vaultType } = props;
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
