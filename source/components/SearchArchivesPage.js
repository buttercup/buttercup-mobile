import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { CellInput, CellGroup, Cell } from "react-native-cell-components";
import { getMatchingEntriesForSearchTerm, getNameForSource } from "../shared/entries.js";
import debounce from "lodash/debounce";

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

    constructor(props) {
        super(props);

        this.state = {
            entries: [],
            searchTerm: "",
            selectedItemIndex: -1
        };
    }

    changeInput = debounce(function(text) {
        this.setState(
            {
                searchTerm: text,
                selectedItemIndex: -1
            },
            () =>
                getMatchingEntriesForSearchTerm(this.state.searchTerm).then(entries => {
                    this.setState({
                        entries: this.state.searchTerm ? entries : []
                    });
                })
        );
    }, 500);

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
