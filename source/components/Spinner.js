import React from "react";
import Spinner from "react-native-loading-spinner-overlay";

export default ({ text, visible }) => (
    <Spinner
        visible={visible}
        textContent={text}
        overlayColor="rgba(0, 0, 0, 0.75)"
        textStyle={{
            color: "#fff",
            width: "100%",
            textAlign: "center"
        }}
    />
);
