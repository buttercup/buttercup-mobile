import Dropbox from "dropbox";
import Browser from "react-native-browser";

const APP_CLIENT_ID = "5fstmwjaisrt06t";
const CALLBACK_URL = "https://buttercup.pw/";

export function generateAuthorisationURL() {
    const client = new Dropbox({ clientId: APP_CLIENT_ID });
    return client.getAuthenticationUrl(CALLBACK_URL);
}

// export function openAuthPage() {
//     const url = generateAuthorisationURL();
//     Browser.open('https://google.com/', {
//         showUrlWhileLoading: true,
//         // loadingBarTintColor: processColor('#d64bbd'),
//         navigationButtonsHidden: true,
//         showActionButton: false,
//         showDoneButton: true,
//         doneButtonTitle: "Cancel",
//         showPageTitles: true,
//         disableContextualPopupMenu: true,
//         hideWebViewBoundaries: true
//         // buttonTintColor: processColor('#d64bbd'),
//         // titleTintColor: processColor('#d64bbd'),
//         // barTintColor: processColor('#d64bbd')
//     });
// }
