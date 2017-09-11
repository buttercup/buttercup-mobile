import { connect } from "react-redux";
import PopupBrowser from "../components/PopupBrowser.js";
import { getURL } from "../selectors/browser.js";
import { setDropboxAuthenticated, setDropboxAuthenticating, setDropboxAuthToken } from "../actions/dropbox.js";
import { navigateBack } from "../actions/navigation.js";

export default connect(
    (state, ownProps) => ({
        url:                        getURL(state)
    }),
    {
        onDropboxTokenReceived:     token => dispatch => {
            dispatch(setDropboxAuthToken(token));
            dispatch(setDropboxAuthenticated(true));
            dispatch(setDropboxAuthenticating(false));
            dispatch(navigateBack());
        }
    }
)(PopupBrowser);
