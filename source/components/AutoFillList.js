import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PropTypes from "prop-types";
import { CellInput, CellGroup, Cell } from "react-native-cell-components";
import debounce from "debounce";
import Spinner from "./Spinner.js";
import { getNameForSource, searchAllArchives } from "../shared/entries.js";
import { getEntryPath } from "../shared/entry";
import { cancelAutoFill } from "../shared/autofill";
import ToolbarButton from "./ToolbarButton";
import SearchResult from "./SearchResult";

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

class AutoFillList extends Component {
    static navigationOptions = {
        title: "Search Archives",
        headerRight: getRightToolbarButton()
    };

    static propTypes = {
        archives: PropTypes.arrayOf(PropTypes.object).isRequired,
        busySate: PropTypes.arrayOf(PropTypes.object),
        initialEntries: PropTypes.arrayOf(PropTypes.object).isRequired,
        onEntryPress: PropTypes.func.isRequired,
        unlockAllArchives: PropTypes.func.isRequired
    };

    state = {
        archives: [],
        entries: [],
        searchTerm: "",
        selectedItemIndex: -1
    };

    changeInput = debounce(function(text) {
        const searchWithTerm = searchAllArchives;
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
        // setTimeout(() => this.focus(), 150);
    }

    componentWillReceiveProps(nextProps) {
        // Unlock the archives once they rehydrate
        // @TODO: Move to Archives List page, then navigate to this page once unlocked..
        if (!this.state.archives.length && nextProps.archives.length) {
            this.setState({ archives: nextProps.archives });

            this.props.unlockAllArchives();
        }
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
                <Spinner visible={this.props.busyState !== null} text={this.props.busyState} />
            </View>
        );
    }
}

export default AutoFillList;
