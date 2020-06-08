import { connect } from "react-redux";
import PopupBrowser from "../components/PopupBrowser.js";
import { getURL } from "../selectors/browser.js";
import {
    setDropboxAuthenticated,
    setDropboxAuthenticating,
    setDropboxAuthToken
} from "../actions/dropbox.js";
import {
    resetMyButtercupAuth,
    setMyButtercupAccessToken,
    setMyButtercupAuthenticated,
    setMyButtercupAuthenticating,
    setMyButtercupRefreshToken
} from "../actions/myButtercup.js";
import { getTokens as getMyButtercupTokens } from "../library/myButtercup.js";
import { executeNotification } from "../global/notify.js";
import { handleError } from "../global/exceptions.js";
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
            dispatch(setMyButtercupAuthenticating(false));
            dispatch(setMyButtercupAuthenticated(false));
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
        },
        onMyButtercupTokenReceived: authCode => dispatch => {
            return getMyButtercupTokens(authCode)
                .then(tokens => {
                    dispatch(setMyButtercupAccessToken(tokens.accessToken));
                    dispatch(setMyButtercupRefreshToken(tokens.refreshToken));
                    dispatch(setMyButtercupAuthenticating(false));
                    dispatch(setMyButtercupAuthenticated(true));
                    navigateBack();
                    executeNotification(
                        "success",
                        i18n.t("remote.my-buttercup.success.authentication.title"),
                        i18n.t("remote.my-buttercup.success.authentication.description")
                    );
                })
                .catch(err => {
                    dispatch(resetMyButtercupAuth());
                    navigateBack();
                    handleError("Failed authenticating My Buttercup", err);
                });
        }
    }
)(PopupBrowser);
