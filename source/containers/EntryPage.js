import { connect } from "react-redux";
import EntryPage from "../components/EntryPage.js";
import {
    getEntryProperties,
    getEntryTitle
} from "../selectors/entry.js";

export default connect(
    (state, ownProps) => ({
        title:              getEntryTitle(state),
        properties:         getEntryProperties(state)
    }),
    {

    }
)(EntryPage);
