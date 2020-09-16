import React, { PureComponent } from "react";
import SearchBar from "react-native-search-bar";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import PropTypes from "prop-types";
import { CellInput, CellGroup, Cell } from "react-native-cell-components";
import debounce from "debounce";
import { withNamespaces } from "react-i18next";
import { searchUsingTerm, updateSearch } from "../shared/search.js";
import { getSharedArchiveManager } from "../library/buttercup.js";
import i18n from "../shared/i18n";
import SearchResult from "./SearchResult";
import EmptyView from "./EmptyView.js";

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class SearchArchives extends PureComponent {
    static navigationOptions = {
        title: i18n.t("vaults.search")
    };

    static propTypes = {
        currentSourceID: PropTypes.string,
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

    vaultUpdate = null;

    changeInput = debounce(function(text) {
        // const searchWithTerm =
        //     this.props.searchContext === "root" ? searchAllArchives : searchCurrentArchive;
        if (!this.vaultUpdate) {
            const vm = getSharedArchiveManager();
            const vaults =
                this.props.searchContext === "root"
                    ? vm.unlockedSources.map(source => source.vault)
                    : [vm.getSourceForID(this.props.currentSourceID).vault];
            this.vaultUpdate = updateSearch(vaults);
        }
        this.setState(
            {
                searchTerm: text,
                selectedItemIndex: -1
            },
            () =>
                this.vaultUpdate
                    .then(() =>
                        this.state.searchTerm ? searchUsingTerm(this.state.searchTerm) : []
                    )
                    .then(entries => {
                        this.setState({ entries });
                    })
            // searchWithTerm(this.state.searchTerm).then(entries => {
            //     this.setState({
            //         entries: this.state.searchTerm ? entries : []
            //     });
            // })
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
                <When condition={this.state.searchTerm.length > 0}>
                    <EmptyView text={this.props.t("search.no-results")} />
                </When>
                <Otherwise>
                    <EmptyView text={this.props.t("search.start-typing")} />
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
                    placeholder={this.props.t("search.self")}
                    autoCapitalize="none"
                    keyboardType="default"
                    cancelButtonText={this.props.t("search.cancel")}
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

export default withNamespaces()(SearchArchives);
