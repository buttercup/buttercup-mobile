import { connect } from "react-redux";
import AddArchivePage from "../components/AddArchivePage.js";
import {
    getAdditionStage
} from "../selectors/AddArchivePage.js";
import { onArchiveTypeSelected } from "../actions/AddArchivePage.js";

export default connect(
    (state, ownProps) => ({
        stage:                      getAdditionStage(state)
    }),
    {
        onArchiveTypeSelected
    }
)(AddArchivePage);
