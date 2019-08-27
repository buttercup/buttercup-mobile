import { connect } from "react-redux";
import GoogleDriveAuthButton from "../components/GoogleDriveAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/googleDrive";
import { GoogleSignin } from "react-native-google-signin";
import { setGoogleDriveAuthenticated, setGoogleDriveAuthenticating } from "../actions/googleDrive";
import { authenticate as authenticateGoogleDrive } from "../library/googleDrive.js";
import { handleError } from "../global/exceptions.js";

export default connect(
    (state, ownProps) => ({
        authenticated: isAuthenticated(state),
        authenticating: isAuthenticating(state)
    }),
    {
        onSignIn: () => dispatch => {
            dispatch(setGoogleDriveAuthenticated(false));
            dispatch(setGoogleDriveAuthenticating(true));
            authenticateGoogleDrive().catch(err => {
                handleError("Google Drive authentication failed", err);
            });
        },
        onSignOut: () => async dispatch => {
            if (await GoogleSignin.isSignedIn()) {
                await GoogleSignin.signOut();
                dispatch(setGoogleDriveAuthenticated(false));
                dispatch(setGoogleDriveAuthenticating(false));
            }
        }
    }
)(GoogleDriveAuthButton);
