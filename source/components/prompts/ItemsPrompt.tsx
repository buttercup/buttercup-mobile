import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    Icon,
    IndexPath,
    Layout,
    Menu,
    MenuItem,
    Modal,
    StyleService,
    useStyleSheet
} from "@ui-kitten/components";

export interface PromptItem {
    title: string;
    slug: string;
    icon: string;
}

interface ItemsPromptProps {
    items: Array<PromptItem>;
    onCancel: () => void;
    onSelect: (item: PromptItem) => void;
    visible: boolean;
}

const CLOSE_BUTTON_MARGIN = 0;
const CLOSE_BUTTON_SIZE = 32;

const genItemIcon = (name: string) => props => <Icon {...props} name={name} />;

const themedStyles = StyleService.create({
    closeButton: {
        position: "absolute",
        top: CLOSE_BUTTON_MARGIN,
        right: CLOSE_BUTTON_MARGIN,
        color: "color-basic-600",
        width: CLOSE_BUTTON_SIZE,
        height: CLOSE_BUTTON_SIZE,
        flex: 1
    },
    modalContainer: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        left: 0,
        right: 0,
        maxHeight: 350,
        minHeight: 100,
        position: "absolute",
        bottom: 0,
        padding: 10
    }
});

export function ItemsPrompt(props: ItemsPromptProps) {
    const {
        onCancel,
        visible
    } = props;
    return (
        <Modal
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            style={{ position: "absolute", width: "100%", height: "100%" }}
            onBackdropPress={onCancel}
            visible={visible}
        >
            <ModalContent {...props} />
        </Modal>
    );
}

function ModalContent(props: ItemsPromptProps) {
    const {
        items,
        onCancel,
        onSelect
    } = props;
    const styles = useStyleSheet(themedStyles);
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(-1));
    return (
        <Layout style={styles.modalContainer}>
            <Icon
                style={styles.closeButton}
                fill={(styles.closeButton as any).color}
                name="close-circle-outline"
                onPress={onCancel}
            />
            <ScrollView style={{ height: "100%", marginRight: CLOSE_BUTTON_SIZE + 4 }}>
                <Menu
                    onSelect={index => setSelectedIndex(index)}
                    scrollEnabled={false}
                    selectedIndex={selectedIndex}
                    style={{ height: "100%" }}
                >
                    {items.map(item => (
                        <MenuItem
                            disabled={false}
                            accessoryLeft={genItemIcon(item.icon)}
                            key={item.slug}
                            onPress={() => onSelect(item)}
                            title={item.title}
                        />
                    ))}
                </Menu>
            </ScrollView>
        </Layout>
    );
}
