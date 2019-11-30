import { connect } from "react-redux";
import SearchArchivesPage from "../../components/SearchArchivesPage";
import { getEntry } from "../../shared/entry";
import { completeAutoFillWithEntry } from "../../shared/autofill";
import { searchAllArchivesForURLs, searchCurrentArchiveForURLs } from "../../shared/entries";
import { getAutoFillURLs } from "../../selectors/autofill";

const getInitialEntries = state => {
    const autoFillURLs = getAutoFillURLs(state);
    if (autoFillURLs.length) {
        // AutoFill UI Started with a list of URLs to prioritize potential credentials with
        if (getSearchContext(state) === "root") {
            return searchAllArchivesForURLs(autoFillURLs);
        } else {
            return searchCurrentArchiveForURLs(autoFillURLs);
        }
    }
    return [];
};

export default connect(
    (state, ownProps) => ({
        searchContext: "root",
        initialEntries: getInitialEntries(state)
    }),
    {
        onEntryPress: (entryID, sourceID) => dispatch => {
            dispatch(() => {
                const entry = getEntry(sourceID, entryID);
                completeAutoFillWithEntry(sourceID, entry);
            });
        }
    }
)(SearchArchivesPage);
