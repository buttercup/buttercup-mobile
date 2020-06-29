import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import PropTypes from "prop-types";

const MY_BUTTERCUP_AUTHENTICATED_URL = /^https?:\/\/(localhost\:8000|my\.buttercup\.pw)\/oauth\/authorized/;

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
        const { params = {} } = navigation.state;
        const title = params.title || "Browser";
        return {
            title: `${title}`
        };
    };

    constructor(props) {
        super(props);
        this._lastURL = "";
        this.state = {
            detectedToken: false
        };
    }

    componentWillUnmount() {
        if (this.state.detectedToken === false) {
            this.props.onClearToken();
        }
    }

    handleNavigationChange(webviewState) {
        const url = webviewState.url;
        if (this._lastURL !== url) {
            this._lastURL = url;
            this.processTokensFromQuery(url);
            const fragment = url.match(/(#.+)?$/)[1] || "";
            this.processTokensFromFragment(fragment);
        }
    }

    processTokensFromFragment(fragment) {
        const frag = fragment.replace(/^#/, "");
        const blocks = (frag || "").split("&");
        const blockNum = blocks.length;
        for (let i = 0; i < blockNum; i += 1) {
            const [key, value] = blocks[i].split("=");
            if (key === "access_token") {
                this.setState(
                    {
                        detectedToken: true
                    },
                    () => {
                        this.props.onDropboxTokenReceived(value);
                    }
                );
                break;
            }
        }
    }

    processTokensFromQuery(url) {
        if (MY_BUTTERCUP_AUTHENTICATED_URL.test(url)) {
            const match = /[?&]code=([^#&?]+)/.exec(url);
            if (match) {
                this.setState(
                    {
                        detectedToken: true
                    },
                    () => {
                        this.props.onMyButtercupTokenReceived(match[1]);
                    }
                );
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
    onDropboxTokenReceived: PropTypes.func,
    url: PropTypes.string.isRequired
};

PopupBrowser.defaultProps = {
    onDropboxTokenReceived: () => {}
};

export default PopupBrowser;
