import { connect } from "react-redux";
import AddArchive from "../components/AddArchive.js";
import {
    getAdditionStage
} from "../selectors/AddArchivePage.js";
import { onArchiveTypeSelected } from "../actions/AddArchive.js";

export default connect(
    (state, ownProps) => ({
        stage:                      getAdditionStage(state)
    }),
    {
        onArchiveTypeSelected
    }
)(AddArchive);
