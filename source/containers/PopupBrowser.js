import { connect } from "react-redux";
import PopupBrowser from "../components/PopupBrowser.js";
import { getURL } from "../selectors/browser.js";
import {
    setDropboxAuthenticated,
    setDropboxAuthenticating,
    setDropboxAuthToken
} from "../actions/dropbox.js";
import { executeNotification } from "../global/notify.js";
import { navigateBack } from "../shared/nav.js";
import i18n from "../shared/i18n";

export default connect(
    (state, ownProps) => ({
        url: getURL(state)
    }),
    {
        onClearToken: () => dispatch => {
            dispatch(setDropboxAuthenticated(false));
            dispatch(setDropboxAuthenticating(false));
        },
        onDropboxTokenReceived: token => dispatch => {
            dispatch(setDropboxAuthToken(token));
            dispatch(setDropboxAuthenticated(true));
            dispatch(setDropboxAuthenticating(false));
            navigateBack();
            executeNotification(
                "success",
                i18n.t("remote.dropbox.success.authentication.title"),
                i18n.t("remote.dropbox.success.authentication.description")
            );
        }
    }
)(PopupBrowser);
