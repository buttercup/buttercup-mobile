import React, { Component } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Cell, CellGroup } from "react-native-cell-components";
import Spinner from "react-native-loading-spinner-overlay";
import Prompt from "@perrymitchell/react-native-prompt";
import PropTypes from "prop-types";
import { beginNewArchiveProcedure } from "../shared/archives.js";

const BCUP_IMAGE = require("../../resources/images/bcup-256.png");
const FILE_IMAGE = require("../../resources/images/file-256.png");
const FOLDER_IMAGE = require("../../resources/images/folder-256.png");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch"
    },
    scrollContainer: {
        height: "100%",
        width: "100%"
    },
    list: {
        flex: 1
    },
    icon: {
        width: 32,
        height: 32
    }
});

class RemoteExplorer extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: `${params.title}`,
            headerRight: <Button title="New" onPress={beginNewArchiveProcedure} />
        };
    };

    componentDidMount() {
        this.handlePathSelected("/", /* is dir */ true);
    }

    handlePathSelected(newPath, isDir) {
        const scrollResetCB = () => {
            this.refs.directoryScrollView.scrollTo({ y: 0, animated: false });
        };
        this.props.onPathSelected(newPath, isDir, scrollResetCB);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer} ref="directoryScrollView">
                    <CellGroup>
                        <For each="item" of={this.props.items}>
                            {this.renderItem(item)}
                        </For>
                    </CellGroup>
                </ScrollView>
                <Prompt
                    title="Archive Filename"
                    placeholder="Filename"
                    visible={this.props.showNewPrompt}
                    onCancel={() => this.props.cancelNewPrompt()}
                    onSubmit={value => this.props.onNewFilename(value)}
                    textInputProps={{
                        autoCapitalize: "none",
                        spellCheck: false,
                        keyboardType: "default"
                    }}
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
        let image = item.isDir ? FOLDER_IMAGE : FILE_IMAGE;
        if (/\.bcup$/i.test(item.name)) {
            image = BCUP_IMAGE;
        }
        return (
            <Cell
                key={item.name}
                icon={() => <Image source={image} style={styles.icon} />}
                onPress={() => this.handlePathSelected(item.path, item.isDir)}
            >
                <Text>{item.name}</Text>
            </Cell>
        );
    }
}

RemoteExplorer.propTypes = {
    addingArchive: PropTypes.bool.isRequired,
    cancelNewPrompt: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onNewArchiveName: PropTypes.func.isRequired,
    onNewFilename: PropTypes.func.isRequired,
    onNewMasterPassword: PropTypes.func.isRequired,
    onPathSelected: PropTypes.func.isRequired,
    remoteDirectory: PropTypes.string.isRequired,
    showNewName: PropTypes.bool.isRequired,
    showNewPassword: PropTypes.bool.isRequired,
    showNewPrompt: PropTypes.bool.isRequired
};

RemoteExplorer.defaultProps = {
    items: [],
    loading: false,
    remoteDirectory: "/"
};

export default RemoteExplorer;
