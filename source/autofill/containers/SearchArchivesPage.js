import { connect } from "react-redux";
import SearchArchivesPage from "../components/SearchArchivesPage";
import { getEntry } from "../../shared/entry";
import { completeAutoFillWithEntry } from "../../shared/autofill";
import { searchAllArchivesForURLs, searchCurrentArchiveForURLs } from "../../shared/entries";
import { getSearchContext } from "../../selectors/app";
import { getAutoFillIdentity, getAutoFillURLs } from "../../selectors/autofill";

const getInitialEntries = state => {
    const autoFillURLs = getAutoFillURLs(state);
    const autoFillIdentity = getAutoFillIdentity(state);
    if (autoFillURLs.length) {
        // AutoFill UI Started with a list of URLs to prioritize potential credentials with
        if (getSearchContext(state) === "root") {
            return searchAllArchivesForURLs(autoFillURLs);
        } else {
            return searchCurrentArchiveForURLs(autoFillURLs);
        }
    } else if (autoFillIdentity !== null) {
        // AutoFill UI Started due to failure to find match from QuickBar suggestion
        // @TODO!
    }

    return [];
};

export default connect(
    (state, ownProps) => ({
        searchContext: getSearchContext(state),
        initialEntries: getInitialEntries(state)
    }),
    {
        onEntryPress: (entryID, sourceID) => {
            const entry = getEntry(sourceID, entryID);
            completeAutoFillWithEntry(entry);
        }
    }
)(SearchArchivesPage);
