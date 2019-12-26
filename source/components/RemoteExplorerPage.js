import React, { Component } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Cell, CellGroup } from "@sallar/react-native-cell-components";
import Prompt from "@perrymitchell/react-native-prompt";
import PropTypes from "prop-types";
import { beginNewArchiveProcedure } from "../shared/archives.js";
import Spinner from "./Spinner.js";
import { HeaderButtons, Item } from "./HeaderButtons.js";

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
            headerRight: () => (
                <HeaderButtons>
                    <Item title="new" onPress={beginNewArchiveProcedure} />
                </HeaderButtons>
            )
        };
    };

    componentDidMount() {
        this.handlePathSelected(null, "/", /* is dir */ true);
    }

    handlePathSelected(identifier, newPath, isDir) {
        const scrollResetCB = () => {
            this.refs.directoryScrollView.scrollTo({ y: 0, animated: false });
        };
        this.props.onPathSelected(identifier, newPath, isDir, scrollResetCB);
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
                    title="Vault Filename"
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
                    title="Vault Password"
                    placeholder=""
                    visible={this.props.showNewPassword}
                    onCancel={() => this.props.cancelNewPrompt()}
                    onSubmit={value => this.props.onNewMasterPassword(value)}
                    textInputProps={{ secureTextEntry: true }}
                    inputStyle={{ color: "#000" }}
                />
                <Prompt
                    title="Vault Name"
                    placeholder=""
                    visible={this.props.showNewName}
                    onCancel={() => this.props.cancelNewPrompt()}
                    onSubmit={value => this.props.onNewArchiveName(value)}
                    textInputProps={{ keyboardType: "default" }}
                />
                <Spinner visible={this.props.creatingFile} text="Creating Vault" />
                <Spinner visible={this.props.loading} text="Fetching Contents" />
                <Spinner visible={this.props.addingArchive} text="Adding Vault" />
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
                onPress={() => this.handlePathSelected(item.identifier, item.path, item.isDir)}
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
