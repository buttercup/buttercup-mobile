import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import DropboxAuthButton from "../components/DropboxAuthButton.js";
import { isAuthenticated, isAuthenticating } from "../selectors/dropbox.js";
// import { setNewEntryParentGroup } from "../actions/entry.js";

export default connect(
    (state, ownProps) => ({
        authenticated:                      isAuthenticated(state),
        authenticating:                     isAuthenticating(state)
    }),
    {

    }
)(DropboxAuthButton);
