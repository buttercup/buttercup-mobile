import { Clipboard } from "react-native";
import { connect } from "react-redux";
import CodesPage from "../components/CodesPage.js";
import { getOTPCodes } from "../selectors/archiveContents.js";
import { executeNotification } from "../global/notify.js";

export default connect(
    (state, ownProps) => ({
        otpCodes: getOTPCodes(state)
    }),
    {
        copyToClipboard: (name, value) => () => {
            Clipboard.setString(value);
            executeNotification(
                "success",
                "Copied value",
                `Copied digits for '${name}' to clipboard`
            );
        }
    }
)(CodesPage);
