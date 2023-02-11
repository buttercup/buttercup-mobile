import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
    Avatar,
    Button,
    Divider,
    Icon,
    Layout,
    MenuItem,
    OverflowMenu,
    TopNavigation,
    Text,
    IndexPath
} from "@ui-kitten/components";
import { notifyError, notifySuccess } from "../../library/notifications";
import { setBusyState } from "../../services/busyState";
import { lockAllVaults, reset } from "../../services/buttercup";
import { CURRENT_SOURCE } from "../../state/vault";
import { ConfirmPrompt } from "../prompts/ConfirmPrompt";
interface HomeTopBarProps {
    leftMenu?: "vaults" | null;
    navigation: any;
}

const BCUP_ICON = require("../../../resources/images/bcup-256.png");
const MENU_ITEMS = [
    { text: "Add Vault", slug: "add", icon: "plus-outline" },
    { text: "Manage Vaults", slug: "manage", icon: "menu-arrow-outline" },
    { text: "Lock All Vaults", slug: "lock-all", icon: "lock-outline" },
    { text: "Password Generator", slug: "generator", icon: "hash-outline" },
    { text: "Reset Settings", slug: "reset", icon: "close-outline" },
    { text: "About", slug: "about", icon: "info-outline" }
];

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        marginHorizontal: 4
    },
    menuContent: {},
    menu: { maxHeight: 500 }
});

async function handleAllVaultLocking() {
    setBusyState("Locking vaults");
    await lockAllVaults();
    setBusyState(null);
    notifySuccess("Vaults locked", "All vaults have been locked");
}

async function handleClearSettings() {
    setBusyState("Resetting app");
    await reset();
    setBusyState(null);
    notifySuccess("App is reset.", "");
}

function MenuButton(props) {
    const { navigation } = props;
    const [visible, setVisible] = useState(false);
    const [showResetSettingsPrompt, setShowResetSettingsPrompt] = useState(false);
    const onItemSelect = (selected: IndexPath) => {
        const item = MENU_ITEMS[selected.row];
        setVisible(false);
        if (item.slug === "about") {
            navigation.navigate("About");
        } else if (item.slug === "add") {
            navigation.navigate("AddVault");
        } else if (item.slug === "manage") {
            navigation.navigate("ManageVaults");
        } else if (item.slug === "lock-all") {
            handleAllVaultLocking()
                .then(() => {
                    CURRENT_SOURCE.set(null);
                })
                .catch(err => {
                    setBusyState(null);
                    console.error(err);
                    notifyError("Locking Failure", err.message);
                });
        } else if (item.slug === "generator") {
            navigation.navigate("Modal", { screen: "PasswordGenerator" });
        } else if (item.slug === "reset") {
            setShowResetSettingsPrompt(true);
        }
    };

    const renderToggleButton = () => (
        <Button
            {...props}
            appearance="ghost"
            accessoryLeft={MenuIcon}
            onPress={() => setVisible(true)}
            status="basic"
        />
    );

    return (
        <Layout style={styles.menuContent} level="1">
            <OverflowMenu
                anchor={renderToggleButton}
                visible={visible}
                onSelect={onItemSelect}
                onBackdropPress={() => setVisible(false)}
                style={styles.menu}
            >
                {MENU_ITEMS.map(item => (
                    <MenuItem
                        key={item.slug}
                        title={item.text}
                        accessoryLeft={props => <Icon {...props} name={item.icon} />}
                    />
                ))}
            </OverflowMenu>
            <ConfirmPrompt
                cancelable
                prompt="This will remove all vaults and local settings. Are you sure you want to continue?"
                title="Reset settings"
                visible={showResetSettingsPrompt}
                onCancel={() => setShowResetSettingsPrompt(false)}
                onConfirm={() => {
                    handleClearSettings().then(() => setShowResetSettingsPrompt(false));
                }}
            />
        </Layout>
    );
}

function MenuIcon(props) {
    return <Icon {...props} name="menu-outline" />;
}

export function HomeTopBar(props: HomeTopBarProps) {
    const {
        leftMenu = null,
        navigation
    } = props;
    return (
        <>
            <TopNavigation
                title={props => (
                    <Layout style={styles.header}>
                        <Avatar
                            shape="square"
                            size="tiny"
                            source={BCUP_ICON}
                            style={styles.logo}
                        />
                        <Text {...props} category="h5">
                            Buttercup
                        </Text>
                    </Layout>
                )}
                alignment="center"
                accessoryLeft={props =>
                    leftMenu === "vaults"
                        ? <MenuButton {...props} navigation={navigation} />
                        : null
                }
            />
            <Divider />
        </>
    );
}
