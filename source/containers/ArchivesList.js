import { connect } from "react-redux";
import { Alert } from "react-native";
import VError from "verror";
import ArchivesList from "../components/ArchivesList.js";
import {
    getArchivesDisplayList,
    getSourceIDsUsingTouchID,
    isUnlocking,
    shouldShowUnlockPasswordPrompt
} from "../selectors/archives.js";
import { setIsUnlocking, showUnlockPasswordPrompt } from "../actions/archives.js";
import { setSelectedSource } from "../actions/archiveContents.js";
import { navigateToGroups } from "../actions/navigation.js";
import {
    checkSourceHasOfflineCopy,
    lockSource,
    unlockSource,
    updateCurrentArchive
} from "../shared/archiveContents.js";
import { promptRemoveArchive } from "../shared/archives.js";
import { handleError } from "../global/exceptions.js";
import { ERROR_CODE_DECRYPT_ERROR } from "../global/symbols.js";

function openArchive(dispatch, getState, sourceID) {
    const state = getState();
    // Get selected title
    const archivesList = getArchivesDisplayList(state);
    const targetSource = archivesList.find(source => source.id === sourceID);
    // Select source
    dispatch(setSelectedSource(sourceID));
    // populate groups
    updateCurrentArchive();
    // navigate to archive contents
    dispatch(navigateToGroups({ groupID: "0", title: `🗂 ${targetSource.name}` }));
}

function performOfflineProcedure(dispatch, getState, sourceID, password) {
    return checkSourceHasOfflineCopy(sourceID).then(hasOffline => {
        if (!hasOffline) {
            return;
        }
        Alert.alert(
            "Offline Content",
            "Would you like to try and load this archive in offline (read-only) mode?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Open",
                    style: "default",
                    onPress: () => {
                        dispatch(setIsUnlocking(true));
                        performSourceUnlock(dispatch, getState, sourceID, password, true);
                    }
                }
            ]
        );
    });
}

function performSourceUnlock(dispatch, getState, sourceID, password, useOffline = false) {
    dispatch(setIsUnlocking(true));
    dispatch(showUnlockPasswordPrompt(false));
    return unlockSource(sourceID, password).then(() => {
        // success!
        dispatch(setIsUnlocking(false));
        // open source
        openArchive(dispatch, getState, sourceID);
    });
}

export default connect(
    (state, ownProps) => ({
        archives: getArchivesDisplayList(state),
        isUnlocking: isUnlocking(state),
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
                dispatch(setIsUnlocking(false));
                handleError("Failed unlocking archive", err);
                const { code: errorCode } = VError.info(err);
                if ((errorCode && errorCode !== ERROR_CODE_DECRYPT_ERROR) || !errorCode) {
                    return performOfflineProcedure(dispatch, getState, sourceID, password);
                }
            });
        }
    }
)(ArchivesList);
