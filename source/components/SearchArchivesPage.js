import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import PropTypes from "prop-types";
import { CellInput, CellGroup, Cell } from "react-native-cell-components";
import debounce from "debounce";
import { searchAllArchives, searchCurrentArchive } from "../shared/entries.js";
import SearchResult from "./SearchResult";

/*TODO:
    maybe add search highlight
    Test on Device
*/

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class SearchArchives extends Component {
    static navigationOptions = {
        title: "Search Vaults"
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

    renderSearchResults() {
        return (
            <CellGroup>
                <For each="result" of={this.state.entries}>
                    <SearchResult
                        key={result.entry.id}
                        sourceID={result.sourceID}
                        entryID={result.entry.id}
                        onEntryPress={this.props.onEntryPress}
                    />
                </For>
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
