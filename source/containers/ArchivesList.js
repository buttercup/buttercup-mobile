import { connect } from "react-redux";
import { Alert } from "react-native";
import VError from "verror";
import i18n from "../shared/i18n";
import ArchivesList from "../components/ArchivesList.js";
import {
    getArchivesDisplayList,
    getSourceIDsUsingTouchID,
    shouldShowUnlockPasswordPrompt
} from "../selectors/archives.js";
import { setBusyState, setSearchContext } from "../actions/app.js";
import { getBusyState } from "../selectors/app.js";
import { showUnlockPasswordPrompt } from "../actions/archives.js";
import { markCurrentSourceReadOnly, setSelectedSource } from "../actions/archiveContents.js";
import { navigateToGroups } from "../actions/navigation.js";
import {
    checkSourceHasOfflineCopy,
    getSourceReadonlyStatus,
    lockSource,
    unlockSource,
    updateCurrentArchive
} from "../shared/archiveContents.js";
import { promptRemoveArchive } from "../shared/archives.js";
import { handleError } from "../global/exceptions.js";
import { getConnectedStatus } from "../global/connectivity.js";
import { ERROR_CODE_DECRYPT_ERROR } from "../global/symbols.js";
import { executeNotification } from "../global/notify.js";
import { getSharedArchiveManager } from "../library/buttercup";
import {
    getKeychainCredentialsFromTouchUnlock,
    touchIDEnabledForSource
} from "../shared/touchUnlock";
import { navigateToSearchArchives } from "../actions/navigation";
import { getIsContextAutoFill } from "../selectors/autofill";

const openArchive = sourceID => (dispatch, getState) => {
    const state = getState();
    const isContextAutoFill = getIsContextAutoFill(state);
    // Get selected title
    const archivesList = getArchivesDisplayList(state);
    const targetSource = archivesList.find(source => source.id === sourceID);
    // Select source
    dispatch(setSelectedSource(sourceID));
    const isReadOnly = getSourceReadonlyStatus(sourceID);
    dispatch(markCurrentSourceReadOnly(isReadOnly));
    // populate groups
    updateCurrentArchive();
    // navigate to archive contents
    dispatch(setSearchContext("archive"));
    if (isContextAutoFill) {
        // To keep things lightweight, in autofill mode (ios) we can only browse entries via Search
        dispatch(navigateToSearchArchives());
    } else {
        dispatch(navigateToGroups({ groupID: "0", title: `🗂 ${targetSource.name}` }));
    }
};

const performOfflineProcedure = (sourceID, password, isOffline = false) => (dispatch, getState) => {
    return checkSourceHasOfflineCopy(sourceID).then(hasOffline => {
        if (!hasOffline) {
            return false;
        }
        Alert.alert(
            isOffline ? "Offline Content (currently offline)" : "Offline Content",
            "Would you like to try and load this archive in offline (read-only) mode?",
            [
                {
                    text: i18n.t("cancel"),
                    style: "cancel",
                    onPress: () => {
                        dispatch(setBusyState(null));
                    }
                },
                {
                    text: i18n.t("use-offline"),
                    style: "default",
                    onPress: () => {
                        dispatch(performSourceUnlock(sourceID, password, true))
                            .then(() => {
                                setTimeout(() => {
                                    executeNotification(
                                        "info",
                                        "Read-Only Mode",
                                        "This archive was opened in read-only mode due to being offline. " +
                                            "Changes will not be possible and certain features will be disabled."
                                    );
                                }, 1000);
                            })
                            .catch(err => {
                                handleError("Failed unlocking archive", err);
                            });
                    }
                }
            ]
        );
        return true;
    });
};

const performSourceUnlock = (sourceID, password, useOffline = false) => (dispatch, getState) => {
    const isContextAutoFill = getIsContextAutoFill(getState());
    dispatch(showUnlockPasswordPrompt(false));
    dispatch(setBusyState(i18n.t("busy-state.checking-connection")));
    return getConnectedStatus().then(connected => {
        dispatch(setBusyState(i18n.t("busy-state.unlocking")));
        if (!connected && isContextAutoFill) {
            // It is assumed the user is online when attempting to autofill
            // @TODO: Test and handle offline cases (perhaps with offline login??)
            // Dev Note: 'Alert' does not work in the iOS AutoFill Extension.
            throw new Error("Failed unlocking: Device not online");
        } else if (!connected && !useOffline) {
            return dispatch(performOfflineProcedure(sourceID, password, true)).then(usedOffline => {
                if (!usedOffline) {
                    throw new Error("Failed unlocking: Device not online");
                }
            });
        }
        return unlockSource(sourceID, password, useOffline).then(() => {
            // success!
            dispatch(setBusyState(null));
            // open source
            dispatch(openArchive(sourceID));
        });
    });
};

const unlockAllTouchArchives = () => dispatch => {
    dispatch(setBusyState(i18n.t("busy-state.unlocking-touch-archives")));
    // Find all the sources that have TouchID Enabled
    const sources = getSharedArchiveManager().sourcesList;
    return Promise.all(sources.map(source => touchIDEnabledForSource(source.id))).then(results => {
        // Build a list of source that need to be unlock
        let sourceIDsToUnlock = [];
        results.forEach((enabled, index) => {
            if (enabled) {
                sourceIDsToUnlock.push(sources[index].id);
            }
        });

        if (sourceIDsToUnlock.length) {
            // First check if we can access the Keychain (maybe the user disabled access?)
            return getKeychainCredentialsFromTouchUnlock()
                .then(keychainCreds => {
                    // Great we're in, now check for internet and unlock
                    dispatch(setBusyState(i18n.t("busy-state.checking-connection")));
                    return getConnectedStatus().then(connected => {
                        dispatch(setBusyState(i18n.t("busy-state.unlocking-touch-archives")));
                        if (!connected) {
                            throw new Error("Failed unlocking: Device not online");
                        }

                        let unlockPromises = [];
                        Object.keys(keychainCreds).forEach(sourceID => {
                            if (sourceIDsToUnlock.indexOf(sourceID) > -1) {
                                unlockPromises.push(
                                    unlockSource(sourceID, keychainCreds[sourceID])
                                );
                            }
                        });

                        return Promise.all(unlockPromises);
                    });
                })
                .then(() => {
                    // success!
                    dispatch(setBusyState(null));

                    // Go directly to the search page. The user can come back and manually unlock others if they want.
                    dispatch(setSearchContext("root"));
                    dispatch(navigateToSearchArchives());
                });
        } else {
            // No Touch enabled sources.. thats fine, the user can unlock manually
            dispatch(setBusyState(null));
        }
    });
};

export default connect(
    (state, ownProps) => ({
        archives: getArchivesDisplayList(state),
        busyState: getBusyState(state),
        showUnlockPrompt: shouldShowUnlockPasswordPrompt(state),
        sourcesUsingTouchUnlock: getSourceIDsUsingTouchID(state),
        isContextAutoFill: getIsContextAutoFill(state)
    }),
    {
        lockArchive: sourceID => dispatch => {
            lockSource(sourceID).catch(err => {
                handleError("Failed locking archive(s)", err);
            });
        },
        removeArchive: sourceID => () => {
            promptRemoveArchive(sourceID);
        },
        selectArchiveSource: openArchive,
        showUnlockPasswordPrompt,
        unlockArchive: (sourceID, password) => dispatch => {
            return dispatch(performSourceUnlock(sourceID, password)).catch(err => {
                dispatch(setBusyState(null));
                handleError("Failed unlocking archive", err);
                const { code: errorCode } = VError.info(err);
                if ((errorCode && errorCode !== ERROR_CODE_DECRYPT_ERROR) || !errorCode) {
                    return dispatch(performOfflineProcedure(sourceID, password));
                }
            });
        },
        unlockAllTouchArchives: () => dispatch => {
            return dispatch(unlockAllTouchArchives()).catch(error => {
                dispatch(setBusyState(null));
                handleError("Unlocking failed", error);
            });
        }
    }
)(ArchivesList);
