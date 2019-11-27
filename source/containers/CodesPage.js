import { connect } from "react-redux";
import CodesPage from "../components/CodesPage.js";
import { getOTPCodes } from "../selectors/archiveContents.js";

export default connect(
    (state, ownProps) => ({
        otpCodes: getOTPCodes(state)
    }),
    {}
)(CodesPage);
