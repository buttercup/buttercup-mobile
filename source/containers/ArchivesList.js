import { connect } from "react-redux";
import { Alert } from "react-native";
import VError from "verror";
import ArchivesList from "../components/ArchivesList.js";
import {
    getArchivesDisplayList,
    getSourceIDsUsingTouchID,
    shouldShowUnlockPasswordPrompt
} from "../selectors/archives.js";
import { setBusyState } from "../actions/app.js";
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

function openArchive(dispatch, getState, sourceID) {
    const state = getState();
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
    dispatch(navigateToGroups({ groupID: "0", title: `🗂 ${targetSource.name}` }));
}

function performOfflineProcedure(dispatch, getState, sourceID, password, isOffline = false) {
    return checkSourceHasOfflineCopy(sourceID).then(hasOffline => {
        if (!hasOffline) {
            return false;
        }
        Alert.alert(
            isOffline ? "Offline Content (currently offline)" : "Offline Content",
            "Would you like to try and load this archive in offline (read-only) mode?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Use Offline",
                    style: "default",
                    onPress: () => {
                        performSourceUnlock(dispatch, getState, sourceID, password, true)
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
}

function performSourceUnlock(dispatch, getState, sourceID, password, useOffline = false) {
    return getConnectedStatus().then(connected => {
        if (!connected && !useOffline) {
            return performOfflineProcedure(dispatch, getState, sourceID, password, true).then(
                usedOffline => {
                    if (!usedOffline) {
                        throw new Error("Failed unlocking: Device not online");
                    }
                }
            );
        }
        dispatch(showUnlockPasswordPrompt(false));
        dispatch(setBusyState("Unlocking"));
        return unlockSource(sourceID, password, useOffline).then(() => {
            // success!
            dispatch(setBusyState(null));
            // open source
            openArchive(dispatch, getState, sourceID);
        });
    });
}

export default connect(
    (state, ownProps) => ({
        archives: getArchivesDisplayList(state),
        busyState: getBusyState(state),
        showUnlockPrompt: shouldShowUnlockPasswordPrompt(state),
        sourcesUsingTouchUnlock: getSourceIDsUsingTouchID(state)
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
        selectArchiveSource: sourceID => (dispatch, getState) => {
            openArchive(dispatch, getState, sourceID);
        },
        showUnlockPasswordPrompt,
        unlockArchive: (sourceID, password) => (dispatch, getState) => {
            return performSourceUnlock(dispatch, getState, sourceID, password).catch(err => {
                dispatch(setBusyState(null));
                handleError("Failed unlocking archive", err);
                const { code: errorCode } = VError.info(err);
                if ((errorCode && errorCode !== ERROR_CODE_DECRYPT_ERROR) || !errorCode) {
                    return performOfflineProcedure(dispatch, getState, sourceID, password);
                }
            });
        }
    }
)(ArchivesList);
