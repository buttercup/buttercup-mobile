import React, { PureComponent } from "react";
import SearchBar from "react-native-search-bar";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import PropTypes from "prop-types";
import { CellInput, CellGroup, Cell } from "react-native-cell-components";
import debounce from "debounce";
import { searchAllArchives, searchCurrentArchive } from "../shared/entries.js";
import SearchResult from "./SearchResult";
import EmptyView from "./EmptyView.js";

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class SearchArchives extends PureComponent {
    static navigationOptions = {
        title: "Search Vaults"
    };

    static propTypes = {
        searchContext: PropTypes.oneOf(["root", "archive"]),
        initialEntries: PropTypes.arrayOf(PropTypes.object).isRequired,
        onEntryPress: PropTypes.func.isRequired
    };

    focusSubscription = null;

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
        this.focusSubscription = this.props.navigation.addListener("didFocus", payload => {
            this.focus();
        });
    }

    componentWillUnmount() {
        this.focusSubscription.remove();
    }

    focus() {
        if (this._input) {
            this._input.focus();
        }
    }

    renderSearchResults() {
        return (
            <Choose>
                <When
                    condition={
                        this.state.entries.length > 0 || this.props.initialEntries.length > 0
                    }
                >
                    <CellGroup>
                        <For
                            each="result"
                            of={
                                this.state.entries.length
                                    ? this.state.entries
                                    : this.props.initialEntries
                            }
                        >
                            <SearchResult
                                key={result.entry.id}
                                sourceID={result.sourceID}
                                entryID={result.entry.id}
                                onEntryPress={this.props.onEntryPress}
                            />
                        </For>
                    </CellGroup>
                </When>
                <Otherwise>
                    <EmptyView text="Start typing to search..." />
                </Otherwise>
            </Choose>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <SearchBar
                    ref={input => (this._input = input)}
                    barStyle="default"
                    placeholder="Search"
                    autoCapitalize="none"
                    keyboardType="default"
                    spellCheck={false}
                    tintColor="#454545"
                    onChangeText={text => this.changeInput(text)}
                />
                <ScrollView style={styles.container} keyboardShouldPersistTaps="never">
                    {this.renderSearchResults()}
                </ScrollView>
            </View>
        );
    }
}

export default SearchArchives;
