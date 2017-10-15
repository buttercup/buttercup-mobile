import { connect } from "react-redux";
import ArchivesList from "../components/ArchivesList.js";
import { getArchivesDisplayList, isUnlocking, shouldShowUnlockPasswordPrompt } from "../selectors/archives.js";
import { setIsUnlocking, showUnlockPasswordPrompt } from "../actions/archives.js";
import { setSelectedSource } from "../actions/archiveContents.js";
import { navigateToGroups } from "../actions/navigation.js";
import { lockSource, unlockSource, updateCurrentArchive } from "../shared/archiveContents.js";
import { promptRemoveArchive } from "../shared/archives.js";
import { handleError } from "../global/exceptions.js";

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

export default connect(
    (state, ownProps) => ({
        archives: getArchivesDisplayList(state),
        isUnlocking: isUnlocking(state),
        showUnlockPrompt: shouldShowUnlockPasswordPrompt(state)
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
        setIsUnlocking,
        showUnlockPasswordPrompt,
        unlockArchive: (sourceID, password) => (dispatch, getState) => {
            dispatch(showUnlockPasswordPrompt(false));
            unlockSource(sourceID, password)
                .then(() => {
                    // success!
                    dispatch(setIsUnlocking(false));
                    // open source
                    openArchive(dispatch, getState, sourceID);
                })
                .catch(err => {
                    dispatch(setIsUnlocking(false));
                    handleError("Failed unlocking archive", err);
                });
        }
    }
)(ArchivesList);
