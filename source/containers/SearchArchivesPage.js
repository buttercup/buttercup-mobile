import { connect } from "react-redux";
import SearchArchivesPage from "../components/SearchArchivesPage.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { getEntryTitle, loadEntry } from "../shared/entry.js";
import { navigateToEntry } from "../actions/navigation.js";

export default connect(
    (state, ownProps) => ({}),
    {
        onEntryPress: entryID => (dispatch, getState) => {
            const state = getState();
            const sourceID = getSelectedSourceID(state);
            const entryTitle = getEntryTitle(sourceID, entryID);
            loadEntry(sourceID, entryID);
            dispatch(navigateToEntry({ title: entryTitle }));
        }
    }
)(SearchArchivesPage);
