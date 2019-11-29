import { connect } from "react-redux";
import AddMetaPage from "../components/AddMetaPage.js";
import { getNewMetaKey, getNewMetaValue, getNewMetaValueType } from "../selectors/entry.js";
import { clearNewMeta, setNewMeta, setNewMetaValueType } from "../actions/entry.js";
import { showEntryMetaValueTypeSheet } from "../shared/sheets.js";

export default connect(
    (state, ownProps) => ({
        metaKey: getNewMetaKey(state),
        metaValue: getNewMetaValue(state),
        metaValueType: getNewMetaValueType(state)
    }),
    {
        onChooseValueType: () => () => showEntryMetaValueTypeSheet(),
        onUnmount: () => dispatch => dispatch(clearNewMeta()),
        setMetaValues: (key, value) => dispatch => dispatch(setNewMeta({ key, value })),
        setmetaValueType: valueType => dispatch => dispatch(setNewMetaValueType(valueType))
    }
)(AddMetaPage);
