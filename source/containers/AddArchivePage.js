import { connect } from "react-redux";
import AddArchivePage from "../components/AddArchivePage.js";
import { getAdditionStage } from "../selectors/AddArchivePage.js";
import { onArchiveTypeSelected } from "../actions/AddArchivePage.js";
import { navigateToRemoteConnect } from "../actions/navigation.js";

export default connect(
    (state, ownProps) => ({
        stage: getAdditionStage(state)
    }),
    {
        onArchiveSelected: (type, title) => dispatch => {
            dispatch(onArchiveTypeSelected(type));
            dispatch(navigateToRemoteConnect({ title }));
        }
    }
)(AddArchivePage);
