import { connect } from "react-redux";
import SearchArchivesPage from "../../components/SearchArchivesPage";
import { getEntry } from "../../shared/entry";
import { completeAutoFillWithEntry } from "../../shared/autofill";
import { getAutoFillURLs } from "../../selectors/autofill";

export default connect(
    (state, ownProps) => ({
        autofillURLs: getAutoFillURLs(state),
        currentSourceID: null,
        searchContext: "root"
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
