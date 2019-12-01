import { connect } from "react-redux";
import EditPropertyPage from "../components/EditPropertyPage.js";
import { getEntryEditingProperty } from "../selectors/entry.js";
import { mergeEntryPropertyEdit, setEntryPropertyEdit } from "../actions/entry.js";
import { showEntryPropertyValueTypeSheet } from "../shared/sheets.js";

export default connect(
    (state, ownProps) => ({
        fieldData: getEntryEditingProperty(state)
    }),
    {
        onEditProperty: property => dispatch =>
            dispatch(mergeEntryPropertyEdit({ newProperty: property })),
        onEditValue: value => dispatch => dispatch(mergeEntryPropertyEdit({ newValue: value })),
        onEditValueType: valueType => dispatch =>
            dispatch(mergeEntryPropertyEdit({ newValueType: valueType })),
        onChooseValueType: () => () => showEntryPropertyValueTypeSheet(),
        onUnmount: () => dispatch => dispatch(setEntryPropertyEdit(null))
    }
)(EditPropertyPage);
