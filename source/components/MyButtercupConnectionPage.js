import React, { PureComponent } from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import PropTypes from "prop-types";
import { CellInput, CellGroup, Cell } from "react-native-cell-components";
import { withNamespaces } from "react-i18next";
import i18n from "../shared/i18n";

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class MyButtercupConnectionPage extends PureComponent {
    static navigationOptions = {
        title: i18n.t("My Buttercup - Connect")
    };

    static propTypes = {
        // searchContext: PropTypes.oneOf(["root", "archive"]),
        // initialEntries: PropTypes.arrayOf(PropTypes.object).isRequired,
        // onEntryPress: PropTypes.func.isRequired
    };

    state = {
        entries: [],
        searchTerm: "",
        selectedItemIndex: -1
    };

    render() {
        return (
            <View style={styles.container}>
                {/* <SearchBar
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
                </ScrollView> */}
            </View>
        );
    }
}

export default withNamespaces()(MyButtercupConnectionPage);
