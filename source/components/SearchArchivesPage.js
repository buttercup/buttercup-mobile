import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import PropTypes from "prop-types";
import { CellInput, CellGroup, Cell } from "react-native-cell-components";
import debounce from "debounce";
import { getNameForSource, searchAllArchives, searchCurrentArchive } from "../shared/entries.js";

/*TODO:
    maybe add search highlight
    Test on Device
*/

const ENTRY_ICON = require("../../resources/images/entry-256.png");

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    icon: {
        width: 32,
        height: 32
    },
    entrySubtitle: {
        color: "#777",
        fontSize: 12
    }
});

class SearchArchives extends Component {
    static navigationOptions = {
        title: "Search Archives"
    };

    static propTypes = {
        searchContext: PropTypes.oneOf(["root", "archive"])
    };

    state = {
        entries: [],
        searchTerm: "",
        selectedItemIndex: -1
    };

    changeInput = debounce(function(text) {
        const searchWithTerm =
            this.props.searchContext === "root" ? searchAllArchives : searchCurrentArchive;
        this.setState(
            {
                searchTerm: text,
                selectedItemIndex: -1
            },
            () =>
                searchWithTerm(this.state.searchTerm).then(entries => {
                    this.setState({
                        entries: this.state.searchTerm ? entries : []
                    });
                })
        );
    }, 250);

    componentDidMount() {
        setTimeout(() => this.focus(), 150);
    }

    focus() {
        if (this._input) {
            this._input.focus();
        }
    }

    getEntryIcon() {
        return <Image source={ENTRY_ICON} style={styles.icon} />;
    }

    renderSearchResults() {
        return (
            <CellGroup>
                {this.state.entries.map(entry => (
                    <Cell
                        key={entry.entry._remoteObject.id}
                        icon={this.getEntryIcon}
                        onPress={() => this.props.onEntryPress(entry.entry.id, entry.sourceID)}
                    >
                        <View>
                            <Text>{entry.entry._remoteObject.properties.title || ""}</Text>
                            <Text style={styles.entrySubtitle}>
                                {getNameForSource(entry.sourceID)}
                            </Text>
                        </View>
                    </Cell>
                ))}
            </CellGroup>
        );
    }

    render() {
        const cellOptions = {
            autoCapitalize: "none",
            autoCorrect: false,
            keyboardType: "default",
            spellCheck: false
        };
        return (
            <View style={styles.container}>
                <CellInput
                    title=""
                    icon="search"
                    onChangeText={text => this.changeInput(text)}
                    ref={input => (this._input = input)}
                    {...cellOptions}
                />
                <ScrollView style={styles.container} keyboardShouldPersistTaps={"handled"}>
                    {this.renderSearchResults()}
                </ScrollView>
            </View>
        );
    }
}

export default SearchArchives;
