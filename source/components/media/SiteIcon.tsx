import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { CachedImage } from "@georstat/react-native-image-cache";
import { DEFAULT_ENTRY_TYPE, EntryType } from "buttercup";

interface SiteIconProps {
    domain?: string;
    size: number;
    type: EntryType;
}

const ICON_LOGIN = require("../../../resources/images/icons/login.png");
const ICON_WEBSITE = require("../../../resources/images/icons/website.png");
const ICON_NOTE = require("../../../resources/images/icons/note.png");
const ICON_SSH = require("../../../resources/images/icons/ssh.png");
const ICON_CREDITCARD = require("../../../resources/images/icons/credit-card.png");

const ICON_LOOKUP = "https://icon.buttercup.pw/icon/";
const ICON_TYPES = {
    [EntryType.Login]: ICON_LOGIN,
    [EntryType.Website]: ICON_WEBSITE,
    [EntryType.SSHKey]: ICON_SSH,
    [EntryType.Note]: ICON_NOTE,
    [EntryType.CreditCard]: ICON_CREDITCARD
};

const styles = StyleSheet.create({
    imageContainer: {
        overflow: "hidden"
    }
});

export function SiteIcon(props: SiteIconProps) {
    const { domain, size, type = DEFAULT_ENTRY_TYPE } = props;
    return (
        <View style={styles.imageContainer}>
            {domain && (
                <CachedImage
                    loadingImageComponent={() => (
                        <Image
                            style={{
                                height: size,
                                width: size
                            }}
                            source={ICON_TYPES[type]}
                        />
                    )}
                    source={`${ICON_LOOKUP}${encodeURIComponent(domain)}`}
                    style={{ height: size, width: size }}
                />
            )}
            {!domain && (
                <Image
                    style={{
                        height: size,
                        width: size
                    }}
                    source={ICON_TYPES[type]}
                />
            )}
        </View>
    );
}
