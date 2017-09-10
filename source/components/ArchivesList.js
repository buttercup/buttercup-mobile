import React, { Component } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from "react-native";
import {
    List,
    ListItem
} from "react-native-elements";
import PropTypes from "prop-types";
import Prompt from "react-native-prompt";
import Spinner from "react-native-loading-spinner-overlay";
import Swipeout from "react-native-swipeout";
import SwipeoutButton from "./SwipeoutButton.js";

const ARCHIVE_ICON_INSET = 10;
const ARCHIVE_ICON_SIZE = 40;
const ARCHIVE_IMAGE_PENDING = require("../../resources/images/pending-256.png");
const ARCHIVE_IMAGE_LOCKED = require("../../resources/images/locked-256.png");
const ARCHIVE_IMAGE_UNLOCKED = require("../../resources/images/unlocked-256.png");
const ARCHIVE_ITEM_HEIGHT = 64;
const ARCHIVE_SWIPE_BUTTON_WIDTH = 80;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
        paddingTop: 30
    },
    archivesList: {
        marginBottom: 20,
        width: "100%"
    },
    archiveIcon: {
        width: ARCHIVE_ICON_SIZE,
        height: ARCHIVE_ICON_SIZE,
        marginLeft: 10
    },
    archiveText: {
        width: 300,
        height: 20,
        alignSelf: "center",
        flex: 2,
        marginLeft: 8
    },
    itemContainerView: {
        width: "100%",
        height: ARCHIVE_ITEM_HEIGHT,
        backgroundColor: "blue"
    },
    itemSwipeout: {
        width: "100%",
        height: ARCHIVE_ITEM_HEIGHT,
        backgroundColor: "white",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#BBB"
    },
    itemView: {
        width: "100%",
        height: ARCHIVE_ITEM_HEIGHT,
        flex: 0,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center"
    }
});

const ARCHIVE_SWIPE_BUTTONS = [
    { text: "Remove", component: <SwipeoutButton>Remove</SwipeoutButton>, _type: "remove" }
];

class ArchivesList extends Component {

    constructor(...args) {
        super(...args);
        this.lastSelectedSourceID = null;
    }

    handleArchiveLockRequest(sourceID, status) {
        if (status === "unlocked") {
            this.props.lockArchive(sourceID);
        } else {
            alert("Cannot lock archive that is not unlocked");
        }
    }

    handleArchiveSelection(sourceID, status) {
        if (status === "unlocked") {
            this.props.selectArchiveSource(sourceID);
        } else if (status === "locked") {
            this.lastSelectedSourceID = sourceID;
            this.props.showUnlockPasswordPrompt(true);
        } else {
            alert("Uhh.. seems that's not working right now :(");
        }
    }

    handlePasswordEntered(password) {
        this.props.setIsUnlocking(true);
        this.props.unlockArchive(this.lastSelectedSourceID, password)
    }

    handleSwipeoutButtonPress(buttonInfo, archiveInfo) {
        const { _type: type } = buttonInfo;
        const { id: sourceID } = archiveInfo;
        switch(type) {
            case "remove": {
                this.props.removeArchive(sourceID);
                break;
            }
            default:
                throw new Error(`Unknown button pressed: ${type}`);
        }
    }

    render() {
        return (
            <View>
                <List style={styles.archivesList}>
                    {this.props.archives.map(archive => this.renderListItem(archive))}
                </List>
                <Prompt
                    title="Archive Password"
                    placeholder=""
                    visible={this.props.showUnlockPrompt}
                    onCancel={() => this.props.showUnlockPasswordPrompt(false)}
                    onSubmit={pass => this.handlePasswordEntered(pass)}
                    textInputProps={{ secureTextEntry: true }}
                    />
                <Spinner
                    visible={this.props.isUnlocking}
                    textContent="Unlocking"
                    textStyle={{ color: "#FFF" }}
                    overlayColor="rgba(0, 0, 0, 0.75)"
                    />
            </View>
        );
    }

    renderListItem(archiveInfo) {
        let image = ARCHIVE_IMAGE_PENDING;
        if (archiveInfo.status === "locked") {
            image = ARCHIVE_IMAGE_LOCKED;
        } else if (archiveInfo.status === "unlocked") {
            image = ARCHIVE_IMAGE_UNLOCKED;
        }
        return (
            <View style={styles.itemContainerView} key={archiveInfo.id}>
                <Swipeout
                    buttonWidth={ARCHIVE_SWIPE_BUTTON_WIDTH}
                    style={styles.itemSwipeout}
                    right={ARCHIVE_SWIPE_BUTTONS.map(info => ({
                        ...info,
                        onPress: () => this.handleSwipeoutButtonPress(info, archiveInfo)
                    }))}
                    >
                        <TouchableHighlight
                            onPress={() => this.handleArchiveSelection(archiveInfo.id, archiveInfo.status)}
                            onLongPress={() => this.handleArchiveLockRequest(archiveInfo.id, archiveInfo.status)}
                            underlayColor="white"
                            >
                                <View style={styles.itemView}>
                                    <Image
                                        source={image}
                                        style={styles.archiveIcon}
                                        />
                                    <Text style={styles.archiveText}>{archiveInfo.name}</Text>
                                </View>
                        </TouchableHighlight>
                </Swipeout>
            </View>
        );
    }

}

ArchivesList.propTypes = {
    archives:                   PropTypes.arrayOf(PropTypes.object),
    isUnlocking:                PropTypes.bool.isRequired,
    lockArchive:                PropTypes.func.isRequired,
    removeArchive:              PropTypes.func.isRequired,
    selectArchiveSource:        PropTypes.func.isRequired,
    showUnlockPrompt:           PropTypes.bool.isRequired,
    showUnlockPasswordPrompt:   PropTypes.func.isRequired,
    unlockArchive:              PropTypes.func.isRequired
};

export default ArchivesList;
