import { Clipboard } from "react-native";
import { connect } from "react-redux";
import CodesPage from "../components/CodesPage.js";
import { getOTPCodes } from "../selectors/archives.js";
import { executeNotification } from "../global/notify.js";
import { otpInstanceFromURL } from "../library/otp.js";

const attachOTPInstance = (otpGroups = []) =>
    otpGroups.map(group => ({
        ...group,
        entries: group.entries.map(codeItem => ({
            ...codeItem,
            ...prepareOTPProps(otpInstanceFromURL(codeItem.otpURL))
        }))
    }));
const prepareOTPProps = otpInstance => ({
    totp: otpInstance,
    period: otpInstance.period,
    timeLeft: otpInstance.period,
    digits: ""
});

export default connect(
    (state, ownProps) => ({
        otpGroups: attachOTPInstance(getOTPCodes(state))
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
