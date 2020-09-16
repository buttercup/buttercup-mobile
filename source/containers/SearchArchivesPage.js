import { connect } from "react-redux";
import SearchArchivesPage from "../components/SearchArchivesPage.js";
import { getEntryTitle, loadEntry } from "../shared/entry.js";
import { navigate, ENTRY_SCREEN } from "../shared/nav.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";

export default connect(
    (state, ownProps) => ({
        currentSourceID: getSelectedSourceID(state),
        searchContext: "root",
        initialEntries: []
    }),
    {
        onEntryPress: (entryID, sourceID) => dispatch => {
            const entryTitle = getEntryTitle(sourceID, entryID);
            loadEntry(sourceID, entryID);
            navigate(ENTRY_SCREEN, { title: entryTitle, readOnly: true });
        }
    }
)(SearchArchivesPage);
