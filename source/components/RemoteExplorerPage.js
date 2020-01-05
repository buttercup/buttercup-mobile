import React, { Component } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Cell, CellGroup } from "react-native-cell-components";
import Prompt from "@perrymitchell/react-native-prompt";
import { withNamespaces } from "react-i18next";
import PropTypes from "prop-types";
import i18n from "../shared/i18n";
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
                    <Item title={i18n.t("vault.new")} onPress={beginNewArchiveProcedure} />
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
                    title={this.props.t("vault.filename")}
                    placeholder={this.props.t("vault.placeholder.filename")}
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
                    title={this.props.t("vault.password")}
                    placeholder=""
                    visible={this.props.showNewPassword}
                    onCancel={() => this.props.cancelNewPrompt()}
                    onSubmit={value => this.props.onNewMasterPassword(value)}
                    textInputProps={{ secureTextEntry: true }}
                    inputStyle={{ color: "#000" }}
                />
                <Prompt
                    title={this.props.t("vault.name")}
                    placeholder=""
                    visible={this.props.showNewName}
                    onCancel={() => this.props.cancelNewPrompt()}
                    onSubmit={value => this.props.onNewArchiveName(value)}
                    textInputProps={{ keyboardType: "default" }}
                />
                <Spinner visible={this.props.creatingFile} text={this.props.t("vault.creating")} />
                <Spinner
                    visible={this.props.loading}
                    text={this.props.t("vault.fetching-contents")}
                />
                <Spinner visible={this.props.addingArchive} text={this.props.t("vault.adding")} />
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

export default withNamespaces()(RemoteExplorer);
