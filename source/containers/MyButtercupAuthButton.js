import { connect } from "react-redux";
import MyButtercupAuthButton from "../components/MyButtercupAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/myButtercup.js";
import {
    setMyButtercupAuthenticated,
    setMyButtercupAuthenticating
} from "../actions/myButtercup.js";
import { authenticate as authenticateMyButtercup } from "../library/myButtercup.js";
import { handleError } from "../global/exceptions.js";
// import i18n from "../shared/i18n";

export default connect(
    (state, ownProps) => ({
        authenticated: isAuthenticated(state),
        authenticating: isAuthenticating(state)
    }),
    {
        onSignIn: () => dispatch => {
            dispatch(setMyButtercupAuthenticated(false));
            dispatch(setMyButtercupAuthenticating(true));
            authenticateMyButtercup();
            // .catch(err => {
            //     dispatch(setMyButtercupAuthenticating(false));
            //     handleError(i18n.t("remote.errors.my-buttercup.authentication-failed"), err);
            // });
        }
        // onSignIn: () => dispatch => {
        //     dispatch(setGoogleDriveAuthenticated(false));
        //     dispatch(setGoogleDriveAuthenticating(true));
        //     authenticateGoogleDrive().catch(err => {
        //         handleError(i18n.t("remote.errors.google-drive.authentication-failed"), err);
        //     });
        // },
        // onSignOut: () => async dispatch => {
        //     if (await GoogleSignin.isSignedIn()) {
        //         await GoogleSignin.signOut();
        //         dispatch(setGoogleDriveAuthenticated(false));
        //         dispatch(setGoogleDriveAuthenticating(false));
        //     }
        // }
    }
)(MyButtercupAuthButton);
