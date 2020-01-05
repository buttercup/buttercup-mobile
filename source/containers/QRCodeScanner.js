import { connect } from "react-redux";
import QRCodeScanner from "../components/QRCodeScanner.js";
import { getEntryTitle, loadEntry } from "../shared/entry.js";
import { navigate, ENTRY_SCREEN, navigateBack } from "../shared/nav.js";
import { setPendingOTPURL } from "../actions/app.js";
import { executeNotification } from "../global/notify.js";

export default connect((state, ownProps) => ({}), {
    onOTPUrlDiscovered: url => dispatch => {
        dispatch(setPendingOTPURL(url));
        executeNotification(
            "success",
            "OTP URL detected",
            "Detected a new OTP - edit an entry to save it!",
            15000
        );
        navigateBack();
    }
})(QRCodeScanner);
