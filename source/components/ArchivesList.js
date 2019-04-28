import React, { Component } from "react";
import {
    Image,
    StyleSheet,
    ListView,
    Text,
    TouchableHighlight,
    ScrollView,
    View,
    Button
} from "react-native";
import { withNamespaces } from "react-i18next";
import { SwipeListView } from "react-native-swipe-list-view";
import { List, ListItem } from "react-native-elements";
import PropTypes from "prop-types";
import Prompt from "@perrymitchell/react-native-prompt";
import Swipeout from "react-native-swipeout";
import Spinner from "./Spinner.js";
import SwipeoutButton from "./SwipeoutButton.js";
import EmptyView from "./EmptyView.js";
import { getArchiveTypeDetails } from "../library/archives.js";
import {
    getMasterPasswordFromTouchUnlock,
    touchIDEnabledForSource
} from "../shared/touchUnlock.js";
import { handleError } from "../global/exceptions.js";

const ARCHIVE_ITEM_HEIGHT = 70;
const ARCHIVE_ITEM_CONTENTS_HEIGHT = 45;
const ARCHIVE_SWIPE_BUTTON_WIDTH = 80;
const BENCH_IMAGE = require("../../resources/images/bench.png");
const FINGERPRINT_IMAGE = require("../../resources/images/fingerprint.png");
const LOCK_IMAGE = require("../../resources/images/locked.png");
const READONLY_IMAGE = require("../../resources/images/readonly.png");

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
        height: ARCHIVE_ITEM_CONTENTS_HEIGHT,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row"
    },
    archiveLockImage: {
        width: 24,
        height: 24,
        marginRight: 10,
        tintColor: "#333"
    },
    archiveTouchImage: {
        width: 24,
        height: 24,
        marginRight: 10,
        tintColor: "#333"
    },
    archiveReadOnlyImage: {
        width: 24,
        height: 24,
        marginRight: 10,
        tintColor: "#AAA"
    },
    archiveIcon: {
        flex: 0,
        width: ARCHIVE_ITEM_CONTENTS_HEIGHT,
        height: ARCHIVE_ITEM_CONTENTS_HEIGHT,
        alignSelf: "center",
        marginLeft: 10,
        backgroundColor: "red",
        borderRadius: ARCHIVE_ITEM_CONTENTS_HEIGHT / 2,
        alignItems: "center",
        justifyContent: "center"
    },
    archiveIconUnlocked: {
        backgroundColor: "#5CAB7D"
    },
    archiveIconLocked: {
        backgroundColor: "#f15c5c"
    },
    archiveIconText: {
        color: "white",
        fontSize: 20,
        fontWeight: "300"
    },
    archiveDetails: {
        flex: 1,
        marginLeft: 12,
        flexDirection: "column",
        justifyContent: "center"
    },
    archiveDetailsSubView: {
        flexDirection: "row",
        alignItems: "center"
    },
    archiveTitle: {
        fontSize: 18
    },
    archiveSubtitle: {
        color: "#777",
        fontSize: 12
    },
    archiveTypeImage: {
        width: 17,
        height: 17,
        marginRight: 5
    },
    swipedViewContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    swipedViewTouchView: {
        flex: 1
    },
    swipedViewText: {
        flex: 0,
        color: "#fff",
        marginRight: 12
    }
});

const ARCHIVE_SWIPE_BUTTONS = [
    { text: "Remove", component: <SwipeoutButton>Remove</SwipeoutButton>, _type: "remove" }
];

function getArchiveAbbr(archiveName) {
    return archiveName.substr(0, 1).toUpperCase() + archiveName.substr(1, 1);
}

class ArchivesList extends Component {
    static propTypes = {
        archives: PropTypes.arrayOf(PropTypes.object),
        busyState: PropTypes.string,
        lockArchive: PropTypes.func.isRequired,
        removeArchive: PropTypes.func.isRequired,
        selectArchiveSource: PropTypes.func.isRequired,
        showUnlockPrompt: PropTypes.bool.isRequired,
        showUnlockPasswordPrompt: PropTypes.func.isRequired,
        sourcesUsingTouchUnlock: PropTypes.arrayOf(PropTypes.string).isRequired,
        unlockArchive: PropTypes.func.isRequired
    };

    constructor(...args) {
        super(...args);
        this.lastSelectedSourceID = null;
        this.rehydrationComplete = false;
    }

    componentWillReceiveProps(nextProps) {
        // If in AutoFill mode, attempt to unlock the archives once the have rehydrated
        if (!this.rehydrationComplete && nextProps.archives.length) {
            this.rehydrationComplete = true;

            if (this.props.isContextAutoFill) {
                // Delay a little bit to allow the render to finish
                setTimeout(this.props.unlockAllTouchArchives, 500);
            }
        }
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
            touchIDEnabledForSource(sourceID)
                .then(enabled => {
                    if (enabled) {
                        return this.handleArchiveTouchUnlock(sourceID);
                    }
                    this.props.showUnlockPasswordPrompt(true);
                })
                .catch(err => {
                    handleError("Unlocking failed", err);
                });
        } else {
            handleError("Unlocking failed", new Error(`Unexpected archive state: ${status}`));
        }
    }

    handleArchiveTouchUnlock(sourceID) {
        return getMasterPasswordFromTouchUnlock(sourceID).then(result => {
            if (typeof result === "string") {
                return this.handlePasswordEntered(result);
            }
            switch (result.action) {
                case "fallback":
                    this.props.showUnlockPasswordPrompt(true);
                    break;
                case "cancel":
                    // do nothing
                    break;
                default:
                    throw new Error(`Unlock failed: Unknown authentication result: ${action}`);
            }
        });
    }

    handlePasswordEntered(password) {
        this.props.unlockArchive(this.lastSelectedSourceID, password);
    }

    handleSwipeoutButtonPress(archiveInfo) {
        const { id: sourceID } = archiveInfo;
        this.props.removeArchive(sourceID);
    }

    renderArchiveItem(archiveInfo) {
        const { title: typeTitle, image: typeImage } = ARCHIVE_TYPES[archiveInfo.type];
        return (
            <TouchableHighlight
                onPress={() => this.handleArchiveSelection(archiveInfo.id, archiveInfo.status)}
                onLongPress={() =>
                    this.handleArchiveLockRequest(archiveInfo.id, archiveInfo.status)
                }
                underlayColor="white"
            >
                <View style={styles.swipeRow}>
                    <View style={styles.rowContents}>
                        <View
                            style={[
                                styles.archiveIcon,
                                archiveInfo.status === "locked"
                                    ? styles.archiveIconLocked
                                    : styles.archiveIconUnlocked
                            ]}
                        >
                            <Text style={styles.archiveIconText}>
                                {getArchiveAbbr(archiveInfo.name)}
                            </Text>
                        </View>
                        <View style={styles.archiveDetails}>
                            <Text style={styles.archiveTitle}>{archiveInfo.name}</Text>
                            <View style={styles.archiveDetailsSubView}>
                                <Image source={typeImage} style={styles.archiveTypeImage} />
                                <Text style={styles.archiveSubtitle}>
                                    {typeTitle.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                        <If condition={archiveInfo.readOnly}>
                            <Image source={READONLY_IMAGE} style={styles.archiveReadOnlyImage} />
                        </If>
                        <If condition={archiveInfo.status === "locked"}>
                            <Choose>
                                <When
                                    condition={this.props.sourcesUsingTouchUnlock.includes(
                                        archiveInfo.id
                                    )}
                                >
                                    <Image
                                        source={FINGERPRINT_IMAGE}
                                        style={styles.archiveTouchImage}
                                    />
                                </When>
                                <Otherwise>
                                    <Image source={LOCK_IMAGE} style={styles.archiveLockImage} />
                                </Otherwise>
                            </Choose>
                        </If>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    renderArchiveItemSubview(archiveInfo) {
        // this.handleSwipeoutButtonPress(info, archiveInfo)
        return (
            <TouchableHighlight
                style={styles.swipedViewTouchView}
                onPress={() => this.handleSwipeoutButtonPress(archiveInfo)}
                underlayColor="white"
            >
                <View style={styles.swipedViewContainer}>
                    <Text style={styles.swipedViewText}>{this.props.t("remove")}</Text>
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
                            renderHiddenRow={archiveInfo =>
                                this.renderArchiveItemSubview(archiveInfo)
                            }
                            disableLeftSwipe={this.props.isContextAutoFill}
                            disableRightSwipe={true}
                            rightOpenValue={0 - ARCHIVE_SWIPE_BUTTON_WIDTH}
                        />
                    </When>
                    <Otherwise>
                        <EmptyView
                            text={this.props.t("archives.add-to-begin")}
                            imageSource={BENCH_IMAGE}
                        />
                    </Otherwise>
                </Choose>
                <Prompt
                    title={this.props.t("archives.archive-password")}
                    placeholder=""
                    visible={this.props.showUnlockPrompt}
                    onCancel={() => this.props.showUnlockPasswordPrompt(false)}
                    onSubmit={pass => this.handlePasswordEntered(pass)}
                    textInputProps={{ secureTextEntry: true }}
                />
                <Spinner visible={this.props.busyState !== null} text={this.props.busyState} />
            </View>
        );
    }
}

export default withNamespaces()(ArchivesList);
