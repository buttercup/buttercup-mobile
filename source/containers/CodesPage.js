import { Clipboard } from "react-native";
import { connect } from "react-redux";
import CodesPage from "../components/CodesPage.js";
import { getOTPCodes } from "../selectors/archives.js";
import { executeNotification } from "../global/notify.js";
import { otpInstanceFromURL } from "../library/otp.js";

const attachOTPInstance = (otpGroups = []) =>
    otpGroups.map(group => ({
        ...group,
        entries: group.entries.reduce((output, codeItem) => {
            let otpInstance;
            try {
                otpInstance = otpInstanceFromURL(codeItem.otpURL);
            } catch (err) {
                return [
                    ...output,
                    {
                        ...codeItem,
                        ...prepareOTPProps(null),
                        error: true
                    }
                ];
            }
            return [
                ...output,
                {
                    ...codeItem,
                    ...prepareOTPProps(otpInstance)
                }
            ];
        }, [])
        // entries: group.entries.map(codeItem => ({
        //     ...codeItem,
        //     ...prepareOTPProps(otpInstanceFromURL(codeItem.otpURL))
        // }))
    }));
const prepareOTPProps = otpInstance => ({
    totp: otpInstance,
    period: (otpInstance && otpInstance.period) || null,
    timeLeft: (otpInstance && otpInstance.period) || null,
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
