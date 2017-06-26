import React, { Component } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {
    List,
    ListItem
} from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import Prompt from "react-native-prompt";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        marginTop: 64
    },
    scrollContainer: {
        height: "100%",
        width: "100%"
    }
});

class RemoteExplorer extends Component {

    componentDidMount() {
        this.handlePathSelected("/", /* is dir */ true);
    }

    handlePathSelected(newPath, isDir) {
        const scrollResetCB = () => {
            this.refs.directoryScrollView.scrollTo({ y: 0, animated: false })
        };
        this.props.onPathSelected(newPath, isDir, scrollResetCB);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView styles={styles.scrollContainer} ref="directoryScrollView">
                    <List>
                        {this.props.items.map(item => this.renderItem(item))}
                    </List>
                </ScrollView>
                <Prompt
                    title="Archive Filename"
                    placeholder="Filename"
                    visible={this.props.showNewPrompt}
                    onCancel={() => this.props.cancelNewPrompt()}
                    onSubmit={value => this.props.onNewFilename(value)}
                    textInputProps={{ autoCapitalize: "none", spellCheck: false, keyboardType: "default" }}
                    />
                <Prompt
                    title="Archive Password"
                    placeholder=""
                    visible={this.props.showNewPassword}
                    onCancel={() => this.props.cancelNewPrompt()}
                    onSubmit={value => this.props.onNewMasterPassword(value)}
                    textInputProps={{ secureTextEntry: true }}
                    />
                <Prompt
                    title="Archive Name"
                    placeholder=""
                    visible={this.props.showNewName}
                    onCancel={() => this.props.cancelNewPrompt()}
                    onSubmit={value => this.props.onNewArchiveName(value)}
                    textInputProps={{ keyboardType: "default" }}
                    />
                <Spinner
                    visible={this.props.creatingFile}
                    textContent="Creating Archive"
                    textStyle={{ color: "#FFF" }}
                    overlayColor="rgba(0, 0, 0, 0.75)"
                    />
                <Spinner
                    visible={this.props.loading}
                    textContent="Fetching Contents"
                    textStyle={{ color: "#FFF" }}
                    overlayColor="rgba(0, 0, 0, 0.75)"
                    />
                <Spinner
                    visible={this.props.addingArchive}
                    textContent="Adding Archive"
                    textStyle={{ color: "#FFF" }}
                    overlayColor="rgba(0, 0, 0, 0.75)"
                    />
            </View>
        );
    }

    renderItem(item) {
        const image = item.isDir ?
            "https://opengameart.org/sites/default/files/Flat%20Folder%20icon.png" :
            "http://www.iconeasy.com/icon/png/File%20Type/Slika%201.0%20Location%20Icons/Location%20%20%20FILE.png";
        return (
            <ListItem
                key={item.name}
                title={item.name}
                avatar={{ uri: image }}
                onPress={() => this.handlePathSelected(item.path, item.isDir)}
                hideChevron={true}
                />
        );
    }

}

RemoteExplorer.propTypes = {
    addingArchive:              PropTypes.bool.isRequired,
    cancelNewPrompt:            PropTypes.func.isRequired,
    items:                      PropTypes.array.isRequired,
    loading:                    PropTypes.bool.isRequired,
    onNewArchiveName:           PropTypes.func.isRequired,
    onNewFilename:              PropTypes.func.isRequired,
    onNewMasterPassword:        PropTypes.func.isRequired,
    onPathSelected:             PropTypes.func.isRequired,
    remoteDirectory:            PropTypes.string.isRequired,
    showNewName:                PropTypes.bool.isRequired,
    showNewPassword:            PropTypes.bool.isRequired,
    showNewPrompt:              PropTypes.bool.isRequired
};

RemoteExplorer.defaultProps = {
    items:                      [],
    loading:                    false,
    remoteDirectory:            "/"
};

export default RemoteExplorer;
