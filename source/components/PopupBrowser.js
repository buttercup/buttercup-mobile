import React, { Component } from "react";
import {
    StyleSheet,
    View,
    WebView
} from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class PopupBrowser extends Component {

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    source={{ uri: this.props.url }}
                    />
            </View>
        );
    }

}

PopupBrowser.propTypes = {
    url:                PropTypes.string.isRequired
};

export default PopupBrowser;
