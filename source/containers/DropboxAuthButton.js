import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import DropboxAuthButton from "../components/DropboxAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/dropbox.js";
import { setBrowserURL } from "../actions/browser.js";
import { generateAuthorisationURL } from "../library/dropbox.js";

export default connect(
    (state, ownProps) => ({
        authenticated:                      isAuthenticated(state),
        authenticating:                     isAuthenticating(state)
    }),
    {
        onClick:                            () => (dispatch) => {
            const url = generateAuthorisationURL();
            dispatch(setBrowserURL(url));
            Actions.popupBrowser();
        }
    }
)(DropboxAuthButton);
