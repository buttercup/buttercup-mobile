import { connect } from "react-redux";
import MyButtercupConnectionPage from "../components/MyButtercupConnectionPage.js";
// import { getEntryTitle, loadEntry } from "../shared/entry.js";
// import { navigate, ENTRY_SCREEN } from "../shared/nav.js";

export default connect(
    (state, ownProps) => ({
        // searchContext: "root",
        // initialEntries: []
    }),
    {
        // onEntryPress: (entryID, sourceID) => dispatch => {
        //     const entryTitle = getEntryTitle(sourceID, entryID);
        //     loadEntry(sourceID, entryID);
        //     navigate(ENTRY_SCREEN, { title: entryTitle, readOnly: true });
        // }
    }
)(MyButtercupConnectionPage);
