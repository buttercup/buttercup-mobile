import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Icon, Layout, MenuItem, OverflowMenu } from "@ui-kitten/components";

interface VaultsContentsMenuProps {
    onEntryCreate?: () => void;
    onGroupCreate: () => void;
    onGroupDelete?: () => void;
    readOnly: boolean;
}

const BASE_ITEMS = [{ text: "Add Group", slug: "add-group", icon: "folder-outline", write: true }];
const MENU_ITEMS = [
    ...BASE_ITEMS,
    { text: "Add Entry", slug: "add-entry", icon: "file-outline", write: true },
    {
        text: "Delete Current Group",
        slug: "delete-group",
        icon: "folder-remove-outline",
        write: true
    }
];

const styles = StyleSheet.create({
    menuContent: {}
});

function MenuButton(props: VaultsContentsMenuProps) {
    const { onEntryCreate = null, onGroupCreate, onGroupDelete = null, readOnly } = props;
    const [visible, setVisible] = useState(false);
    const menuItems = useMemo(
        () => (onEntryCreate && onGroupDelete ? MENU_ITEMS : BASE_ITEMS),
        [onEntryCreate]
    );
    const onItemSelect = useCallback(
        selected => {
            const item = menuItems[selected.row];
            setVisible(false);
            if (item.slug === "add-group") {
                onGroupCreate();
            } else if (item.slug === "add-entry") {
                onEntryCreate();
            } else if (item.slug === "delete-group") {
                onGroupDelete();
            }
        },
        [menuItems, onEntryCreate, onGroupCreate, onGroupDelete]
    );
    const renderToggleButton = () => (
        <Button
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
            >
                {menuItems.map(item => (
                    <MenuItem
                        key={item.slug}
                        title={item.text}
                        accessoryLeft={props => <Icon {...props} name={item.icon} />}
                        disabled={item.write && readOnly}
                    />
                ))}
            </OverflowMenu>
        </Layout>
    );
}

function MenuIcon(props) {
    return <Icon {...props} name="menu-outline" />;
}

export function VaultContentsMenu(props: VaultsContentsMenuProps) {
    return <MenuButton {...props} />;
}
