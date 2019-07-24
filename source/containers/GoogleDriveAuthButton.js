import { connect } from "react-redux";
import GoogleDriveAuthButton from "../components/GoogleDriveAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/googleDrive";
import { authenticateWithoutToken } from "../library/googleDrive.js";
// import { setBrowserURL } from "../actions/browser.js";
// import { generateAuthorisationURL } from "../library/dropbox.js";
// import { navigateToPopupBrowser } from "../actions/navigation.js";
// import { setGoogleDriveAuthenticating } from "../actions/googleDrive";

export default connect(
    (state, ownProps) => ({
        authenticated: isAuthenticated(state),
        authenticating: isAuthenticating(state)
    }),
    {
        onClick: () => () => {
            authenticateWithoutToken();
            // const url = generateAuthorisationURL();
            // dispatch(setBrowserURL(url));
            // dispatch(setGoogleDriveAuthenticating(true));
            // dispatch(navigateToPopupBrowser("Google Drive"));
        }
    }
)(GoogleDriveAuthButton);
