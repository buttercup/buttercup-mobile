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
    },
    webView: {
        display: "flex",
        flex: 2,
        height: "100%",
        width: "100%"
    }
});

class PopupBrowser extends Component {

    static navigationOptions = ({ navigation }) => {
        const {params = {}} = navigation.state;
        const title = params.title || "Browser";
        return {
            title: `${title}`
        };
    };

    constructor(props) {
        super(props);
        this._lastURL = "";
    }

    handleNavigationChange(webviewState) {
        const url = webviewState.url;
        if (this._lastURL !== url) {
            this._lastURL = url;
            const fragment = url.match(/(#.+)?$/)[1] || "";
            this.processAccessToken(fragment);
        }
    }

    processAccessToken(fragment) {
        const frag = fragment.replace(/^#/, "");
        const blocks = (frag || "").split("&");
        const blockNum = blocks.length;
        for (let i = 0; i < blockNum; i += 1) {
            const [ key, value ] = blocks[i].split("=");
            if (key === "access_token") {
                this.props.onDropboxTokenReceived(value);
                break;
            }
        }
    }

    render() {
        return (
            <WebView
                source={{ uri: this.props.url }}
                style={styles.webView}
                onNavigationStateChange={state => this.handleNavigationChange(state)}
                />
        );
    }

}

PopupBrowser.propTypes = {
    onDropboxTokenReceived:     PropTypes.func,
    url:                        PropTypes.string.isRequired
};

PopupBrowser.defaultProps = {
    onDropboxTokenReceived:     () => {}
};

export default PopupBrowser;
