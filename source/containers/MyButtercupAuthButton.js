import { connect } from "react-redux";
import MyButtercupAuthButton from "../components/MyButtercupAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/myButtercup.js";
import {
    setMyButtercupAuthenticated,
    setMyButtercupAuthenticating
} from "../actions/myButtercup.js";
import { authenticate as authenticateMyButtercup } from "../library/myButtercup.js";
import { handleError } from "../global/exceptions.js";

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
        }
    }
)(MyButtercupAuthButton);
