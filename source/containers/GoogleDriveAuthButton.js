import { connect } from "react-redux";
import GoogleDriveAuthButton from "../components/GoogleDriveAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/googleDrive.js";
import { setBrowserURL } from "../actions/browser.js";
import { generateAuthorisationURL } from "../library/googleDrive.js";
import { navigateToPopupBrowser } from "../actions/navigation.js";
import { setGoogleDriveAuthenticating } from "../actions/googleDrive.js";

export default connect(
    (state, ownProps) => ({
        authenticated: isAuthenticated(state),
        authenticating: isAuthenticating(state)
    }),
    {
        onClick: () => dispatch => {
            const url = generateAuthorisationURL();
            dispatch(setBrowserURL(url));
            dispatch(setGoogleDriveAuthenticating(true));
            dispatch(navigateToPopupBrowser("googleDrive"));
        }
    }
)(GoogleDriveAuthButton);
