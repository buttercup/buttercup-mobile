import { connect } from "react-redux";
import EditPropertyPage from "../components/EditPropertyPage.js";
import { getEntryEditingProperty } from "../selectors/entry.js";
import { mergeEntryPropertyEdit, setEntryPropertyEdit } from "../actions/entry.js";
import { showEntryPropertyValueTypeSheet } from "../shared/sheets.js";

export default connect(
    (state, ownProps) => ({
        fieldData: getEntryEditingProperty(state)
        // metaKey: getNewMetaKey(state),
        // metaValue: getNewMetaValue(state),
        // metaValueType: getNewMetaValueType(state)
    }),
    {
        onEditProperty: property => dispatch =>
            dispatch(mergeEntryPropertyEdit({ newProperty: property })),
        onEditValue: value => dispatch => dispatch(mergeEntryPropertyEdit({ newValue: value })),
        // onEditValueType: valueType => dispatch => dispatch(mergeEntryPropertyEdit({ valueType })),
        onChooseValueType: () => () => showEntryPropertyValueTypeSheet(),
        onUnmount: () => dispatch => dispatch(setEntryPropertyEdit(null))
        // setMetaValues: (key, value) => dispatch => dispatch(setNewMeta({ key, value })),
        // setmetaValueType: valueType => dispatch => dispatch(setNewMetaValueType(valueType))
    }
)(EditPropertyPage);
