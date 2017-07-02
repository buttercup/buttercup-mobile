import { connect } from "react-redux";
import EntryPage from "../components/EntryPage.js";
import { getEntryTitle } from "../selectors/entry.js";

export default connect(
    (state, ownProps) => ({
        title:              getEntryTitle(state)
    }),
    {

    }
)(EntryPage);
