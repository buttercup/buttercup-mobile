import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PropTypes from "prop-types";
import { CellInput, CellGroup, Cell } from "react-native-cell-components";
import debounce from "debounce";
import { searchAllArchives } from "../../shared/entries.js";
import { cancelAutoFill } from "../../shared/autofill";
import ToolbarButton from "../../components/ToolbarButton";
import SearchResult from "../../components/SearchResult";
import { searchCurrentArchive } from "../../shared/entries";
import i18n from "../../shared/i18n";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cancel: {
        padding: 10
    }
});

function getRightToolbarButton() {
    return <ToolbarButton title={"Cancel"} onPress={cancelAutoFill} />;
}

class SearchArchivesPage extends Component {
    static navigationOptions = {
        title: i18n.t("archive.search"),
        headerRight: getRightToolbarButton()
    };

    static propTypes = {
        searchContext: PropTypes.oneOf(["root", "archive"]),
        initialEntries: PropTypes.arrayOf(PropTypes.object).isRequired,
        onEntryPress: PropTypes.func.isRequired
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
                <For
                    each="result"
                    of={this.state.entries.length ? this.state.entries : this.props.initialEntries}
                >
                    <SearchResult
                        key={result.entry.id}
                        sourceID={result.sourceID}
                        entryID={result.entry.id}
                        onEntryPress={this.props.onEntryPress}
                        icon={<Icon name="sign-in" size={22} color="#5c7080" />}
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

export default SearchArchivesPage;
