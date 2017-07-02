import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import ArchivesList from "../components/ArchivesList.js";
import {
    getArchivesDisplayList,
    isUnlocking,
    shouldShowUnlockPasswordPrompt
} from "../selectors/archives.js";
import {
    setIsUnlocking,
    showUnlockPasswordPrompt
} from "../actions/archives.js";
import {
    setSelectedSource
} from "../actions/ArchiveContentsPage.js";
import {
    removeSource,
    unlockSource,
    updateCurrentArchive
} from "../shared/archiveContents.js";

function openArchive(dispatch, sourceID) {
    dispatch(setSelectedSource(sourceID));
    // populate groups
    updateCurrentArchive();
    // run action
    Actions.archiveContents();
}

export default connect(
    (state, ownProps) => ({
        archives:                   getArchivesDisplayList(state),
        isUnlocking:                isUnlocking(state),
        showUnlockPrompt:           shouldShowUnlockPasswordPrompt(state)
    }),
    {
        removeArchive:              sourceID => () => removeSource(sourceID),
        selectArchiveSource:        sourceID => dispatch => {
            openArchive(dispatch, sourceID);
        },
        setIsUnlocking,
        showUnlockPasswordPrompt,
        unlockArchive:              (sourceID, password) => dispatch => {
            dispatch(showUnlockPasswordPrompt(false));
            unlockSource(sourceID, password)
                .then(() => {
                    // success!
                    dispatch(setIsUnlocking(false));
                    // open source
                    openArchive(dispatch, sourceID);
                })
                .catch(err => {
                    dispatch(setIsUnlocking(false));
                });
        }
    }
)(ArchivesList);
