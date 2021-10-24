import { Linking } from "react-native";
import { notifyError, notifySuccess } from "../library/notifications";
import { storePendingOTPURI } from "./otp";

const URI_PROTO_OTPAUTH = "otpauth://";

function handleURLChange(url: string) {
    if (!url) return;
    const lowerURL = url.toLowerCase();
    if (lowerURL.indexOf(URI_PROTO_OTPAUTH) === 0) {
        const stored = storePendingOTPURI(url);
        if (stored) {
            notifySuccess("OTP Payload Received", "Edit an entry to save it.");
        }
    } else {
        notifyError("Unrecognised URI", "Buttercup received an unrecognised URI request.");
    }
}

export async function initialise() {
    const initialURL = await Linking.getInitialURL();
    if (initialURL) {
        handleURLChange(initialURL);
    }
    const urlChangeHandler = ({ url }: { url: string }) => {
        handleURLChange(url);
    };
    Linking.addEventListener("url", urlChangeHandler);
}
