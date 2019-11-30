import { Clipboard } from "react-native";
import { connect } from "react-redux";
import CodesPage from "../components/CodesPage.js";
import { getOTPCodes } from "../selectors/archiveContents.js";
import { executeNotification } from "../global/notify.js";
import { otpInstanceFromURL } from "../library/otp.js";

const attachOTPInstance = (otpCodes = []) =>
    otpCodes.map(codeItem => ({
        ...codeItem,
        totp: otpInstanceFromURL(codeItem.otpURL),
        period: 30,
        timeLeft: 30,
        digits: ""
    }));

export default connect(
    (state, ownProps) => ({
        otpCodes: attachOTPInstance(getOTPCodes(state))
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
