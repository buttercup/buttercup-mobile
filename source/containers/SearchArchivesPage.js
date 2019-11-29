import { connect } from "react-redux";
import SearchArchivesPage from "../components/SearchArchivesPage.js";
import { getSearchContext } from "../selectors/app.js";
import { getEntryTitle, loadEntry } from "../shared/entry.js";
import { navigate, ENTRY_SCREEN } from "../shared/nav.js";

export default connect(
    (state, ownProps) => ({
        searchContext: getSearchContext(state)
    }),
    {
        onEntryPress: (entryID, sourceID) => dispatch => {
            const entryTitle = getEntryTitle(sourceID, entryID);
            loadEntry(sourceID, entryID);
            navigate(ENTRY_SCREEN, { title: entryTitle });
        }
    }
)(SearchArchivesPage);
