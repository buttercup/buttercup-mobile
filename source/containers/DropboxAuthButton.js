import { connect } from "react-redux";
import DropboxAuthButton from "../components/DropboxAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/dropbox.js";
import { setBrowserURL } from "../actions/browser.js";
import { generateAuthorisationURL } from "../library/dropbox.js";
import { setDropboxAuthenticating } from "../actions/dropbox.js";
import { navigate, POPUP_BROWSER_SCREEN } from "../shared/nav.js";

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
            navigate(POPUP_BROWSER_SCREEN, { title: "Dropbox" });
        }
    }
)(DropboxAuthButton);
