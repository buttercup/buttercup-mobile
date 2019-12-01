import { connect } from "react-redux";
import AddArchivePage from "../components/AddArchivePage.js";
import { getAdditionStage } from "../selectors/AddArchivePage.js";
import { onArchiveTypeSelected } from "../actions/AddArchivePage.js";
import { navigate, REMOTE_CONNECT_SCREEN } from "../shared/nav.js";

export default connect(
    (state, ownProps) => ({
        stage: getAdditionStage(state)
    }),
    {
        onArchiveSelected: (type, title) => dispatch => {
            dispatch(onArchiveTypeSelected(type));
            navigate(REMOTE_CONNECT_SCREEN, { title });
        }
    }
)(AddArchivePage);
