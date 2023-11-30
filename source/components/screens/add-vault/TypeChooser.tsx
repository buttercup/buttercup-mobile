import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";
import { IndexPath, Menu, MenuItem } from "@ui-kitten/components";
import { VAULT_TYPES } from "../../../library/buttercup";

interface TypeChooserProps {
    onSelectType: (type: string) => void;
}

const ICON_SIZE = 22;

const styles = StyleSheet.create({
    icon: {
        height: ICON_SIZE,
        width: ICON_SIZE
    }
});

export function TypeChooser(props: TypeChooserProps) {
    const { onSelectType } = props;
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(-1));
    return (
        <Menu
            selectedIndex={selectedIndex}
            onSelect={index => setSelectedIndex(index)}
            scrollEnabled={false}
        >
            {Object.keys(VAULT_TYPES).map(type => (
                <MenuItem
                    disabled={VAULT_TYPES[type].enabled !== true}
                    accessoryLeft={() => (
                        <Image style={styles.icon} source={VAULT_TYPES[type].icon} />
                    )}
                    key={type}
                    onPress={() => onSelectType(type)}
                    title={VAULT_TYPES[type].title}
                />
            ))}
        </Menu>
    );
}
