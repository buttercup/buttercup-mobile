import { connect } from "react-redux";
import PopupBrowser from "../components/PopupBrowser.js";
import { getURL } from "../selectors/browser.js";
// import { clearNewMeta, setNewMeta } from "../actions/entry.js";

export default connect(
    (state, ownProps) => ({
        url:                        getURL(state)
    }),
    {

    }
)(PopupBrowser);
