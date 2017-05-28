import { connect } from "react-redux";
import AddArchive from "../components/AddArchive.js";
import {
    getAdditionStage
} from "../selectors/AddArchivePage.js";

export default connect(
    (state, ownProps) => ({
        stage: getAdditionStage(state)
    }),
    (dispatch, ownProps) => ({

    })
)(AddArchive);
