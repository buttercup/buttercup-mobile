import { connect } from "react-redux";
import GoogleDriveAuthButton from "../components/GoogleDriveAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/googleDrive";
import { authenticateWithoutToken } from "../library/googleDrive.js";
import { handleError } from "../global/exceptions.js";

export default connect(
    (state, ownProps) => ({
        authenticated: isAuthenticated(state),
        authenticating: isAuthenticating(state)
    }),
    {
        onClick: () => () => {
            authenticateWithoutToken().catch(err => {
                console.error(err);
                handleError("Failed authenticating with Google", err);
            });
        }
    }
)(GoogleDriveAuthButton);
