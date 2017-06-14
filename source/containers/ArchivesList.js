import { connect } from "react-redux";
import ArchivesList from "../components/ArchivesList.js";
import {
    getArchivesDisplayList
} from "../selectors/archives.js";
// import {

// } from "../actions/ArchivesList.js";
// import { Actions } from "react-native-router-flux";

export default connect(
    (state, ownProps) => ({
        archives:               getArchivesDisplayList(state)
    }),
    {

    }
)(ArchivesList);
