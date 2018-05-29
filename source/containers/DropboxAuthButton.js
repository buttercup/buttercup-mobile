import { connect } from "react-redux";
import DropboxAuthButton from "../components/DropboxAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/dropbox.js";
import { setBrowserURL } from "../actions/browser.js";
import { generateAuthorisationURL } from "../library/dropbox.js";
import { navigateToPopupBrowser } from "../actions/navigation.js";
import { setDropboxAuthenticating } from "../actions/dropbox.js";

export default connect(
    (state, ownProps) => ({
        authenticated: isAuthenticated(state),
        authenticating: isAuthenticating(state)
    }),
    {
        onClick: () => dispatch => {
            const url = generateAuthorisationURL();
            dispatch(setBrowserURL(url));
            dispatch(setDropboxAuthenticating(true));
            dispatch(navigateToPopupBrowser("Dropbox"));
        }
    }
)(DropboxAuthButton);
