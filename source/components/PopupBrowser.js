import React, { Component } from "react";
import { StyleSheet, View, WebView } from "react-native";
import PropTypes from "prop-types";

const BUTTERCUP_DOMAIN_REXP = /^https:\/\/buttercup.pw\//;
const DROPBOX_ACCESS_TOKEN_REXP = /access_token=([^&]+)/;

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
            if (BUTTERCUP_DOMAIN_REXP.test(url)) {
                this.processURLToken(url);
            }
        }
    }

    processURLToken(url) {
        const dropboxTokenMatch = url.match(DROPBOX_ACCESS_TOKEN_REXP);
        if (dropboxTokenMatch) {
            this.setState({ detectedToken: true });
            const token = dropboxTokenMatch[1];
            console.log("Retrieved Dropbox access token from browser");
            this.props.onDropboxTokenReceived(token);
        }
    }

    render() {
        return (
            <WebView
                source={{ uri: this.props.url }}
                style={styles.webView}
                onNavigationStateChange={state => this.handleNavigationChange(state)}
                userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/61.0"
            />
        );
    }
}

PopupBrowser.propTypes = {
    onDropboxTokenReceived: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired
};

PopupBrowser.defaultProps = {
    onDropboxTokenReceived: () => {}
};

export default PopupBrowser;
