import { connect } from "react-redux";
import AddMetaPage from "../components/AddMetaPage.js";
import { getNewMetaKey, getNewMetaValue } from "../selectors/entry.js";
import { clearNewMeta, setNewMeta } from "../actions/entry.js";

export default connect(
    (state, ownProps) => ({
        metaKey: getNewMetaKey(state),
        metaValue: getNewMetaValue(state)
    }),
    {
        onUnmount: () => dispatch => dispatch(clearNewMeta()),
        setMetaValues: (key, value) => dispatch => dispatch(setNewMeta({ key, value }))
    }
)(AddMetaPage);
