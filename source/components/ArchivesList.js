import React, { Component } from "react";
import { Image, StyleSheet, ListView, Text, TouchableHighlight, ScrollView, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { List, ListItem } from "react-native-elements";
import PropTypes from "prop-types";
import Prompt from "react-native-prompt";
import Spinner from "react-native-loading-spinner-overlay";
import Swipeout from "react-native-swipeout";
import SwipeoutButton from "./SwipeoutButton.js";
import EmptyView from "./EmptyView.js";
import { getArchiveTypeDetails } from "../library/archives.js";

const ARCHIVE_ICON_INSET = 10;
const ARCHIVE_ICON_SIZE = 40;
const ARCHIVE_IMAGE_PENDING = require("../../resources/images/pending-256.png");
const ARCHIVE_IMAGE_LOCKED = require("../../resources/images/locked-256.png");
const ARCHIVE_IMAGE_UNLOCKED = require("../../resources/images/unlocked-256.png");
const ARCHIVE_ITEM_HEIGHT = 88;
const ARCHIVE_ITEM_CONTENTS_HEIGHT = 62;
const ARCHIVE_SWIPE_BUTTON_WIDTH = 80;
const BENCH_IMAGE = require("../../resources/images/bench.png");

const ARCHIVE_TYPES = getArchiveTypeDetails().reduce((types, nextType) => {
    types[nextType.type] = nextType;
    return types;
}, {});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    swipeRow: {
        flex: 1,
        height: ARCHIVE_ITEM_HEIGHT,
        backgroundColor: "#fff",
        flexDirection: "row"
    },
    rowContents: {
        flex: 1,
        alignSelf: "center",
        height: 62,
        justifyContent: "flex-start",
        flexDirection: "row"
    },
    archiveIcon: {
        flex: 0,
        maxWidth: ARCHIVE_ITEM_CONTENTS_HEIGHT,
        maxHeight: ARCHIVE_ITEM_CONTENTS_HEIGHT,
        alignSelf: "center",
        marginLeft: 10
    },
    archiveDetails: {
        marginLeft: 12,
        flexDirection: "column",
        justifyContent: "center"
    },
    archiveDetailsSubView: {
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    archiveTitle: {
        fontSize: 18
    },
    archiveSubtitle: {
        color: "#777"
    },
    archiveTypeImage: {
        width: 17,
        height: 17,
        marginRight: 5
    }
});

const ARCHIVE_SWIPE_BUTTONS = [{ text: "Remove", component: <SwipeoutButton>Remove</SwipeoutButton>, _type: "remove" }];

class ArchivesList extends Component {
    static propTypes = {
        archives: PropTypes.arrayOf(PropTypes.object),
        isUnlocking: PropTypes.bool.isRequired,
        lockArchive: PropTypes.func.isRequired,
        removeArchive: PropTypes.func.isRequired,
        selectArchiveSource: PropTypes.func.isRequired,
        showUnlockPrompt: PropTypes.bool.isRequired,
        showUnlockPasswordPrompt: PropTypes.func.isRequired,
        unlockArchive: PropTypes.func.isRequired
    };

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
        this.props.unlockArchive(this.lastSelectedSourceID, password);
    }

    handleSwipeoutButtonPress(buttonInfo, archiveInfo) {
        const { _type: type } = buttonInfo;
        const { id: sourceID } = archiveInfo;
        switch (type) {
            case "remove": {
                this.props.removeArchive(sourceID);
                break;
            }
            default:
                throw new Error(`Unknown button pressed: ${type}`);
        }
    }

    renderArchiveItem(archiveInfo) {
        let image = ARCHIVE_IMAGE_PENDING;
        if (archiveInfo.status === "locked") {
            image = ARCHIVE_IMAGE_LOCKED;
        } else if (archiveInfo.status === "unlocked") {
            image = ARCHIVE_IMAGE_UNLOCKED;
        }
        const { title: typeTitle, image: typeImage } = ARCHIVE_TYPES[archiveInfo.type];
        return (
            <TouchableHighlight
                onPress={() => this.handleArchiveSelection(archiveInfo.id, archiveInfo.status)}
                onLongPress={() => this.handleArchiveLockRequest(archiveInfo.id, archiveInfo.status)}
                underlayColor="white"
            >
                <View style={styles.swipeRow}>
                    <View style={styles.rowContents}>
                        <Image source={image} style={styles.archiveIcon} />
                        <View style={styles.archiveDetails}>
                            <Text style={styles.archiveTitle}>{archiveInfo.name}</Text>
                            <View style={styles.archiveDetailsSubView}>
                                <Image source={typeImage} style={styles.archiveTypeImage} />
                                <Text style={styles.archiveSubtitle}>{typeTitle}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        return (
            <View style={styles.container}>
                <Choose>
                    <When condition={this.props.archives.length > 0}>
                        <SwipeListView
                            dataSource={ds.cloneWithRows(this.props.archives)}
                            renderRow={archiveInfo => this.renderArchiveItem(archiveInfo)}
                            renderHiddenRow={archiveInfo => (
                                <View>
                                    <Text>Left</Text>
                                    <Text>Right</Text>
                                </View>
                            )}
                            disableRightSwipe={true}
                            rightOpenValue={-75}
                        />
                    </When>
                    <Otherwise>
                        <EmptyView text="Add a new archive to begin" imageSource={BENCH_IMAGE} />
                    </Otherwise>
                </Choose>
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
}

export default ArchivesList;
