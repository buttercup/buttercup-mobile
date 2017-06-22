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
    setSelectedGroup,
    setSelectedSource
} from "../actions/ArchiveContentsPage.js";
import { unlockSource } from "../shared/archiveContents.js";

export default connect(
    (state, ownProps) => ({
        archives:                   getArchivesDisplayList(state),
        isUnlocking:                isUnlocking(state),
        showUnlockPrompt:           shouldShowUnlockPasswordPrompt(state)
    }),
    {
        selectArchiveSource:        id => dispatch => {
            dispatch(setSelectedSource(id));
            dispatch(setSelectedGroup("0"));
            // run action
            Actions.archiveContents();
        },
        setIsUnlocking,
        showUnlockPasswordPrompt,
        unlockArchive:              (sourceID, password) => dispatch => {
            dispatch(showUnlockPasswordPrompt(false));
            unlockSource(sourceID, password)
                .then(() => {
                    dispatch(setIsUnlocking(false));
                })
                .catch(err => {
                    dispatch(setIsUnlocking(false));
                });
        }
    }
)(ArchivesList);
