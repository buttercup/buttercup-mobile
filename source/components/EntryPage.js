import React, { Component } from "react";
import {
    StyleSheet,
    View
} from "react-native";
import PropTypes from "prop-types";
import { Actions } from "react-native-router-flux";

const styles = StyleSheet.create({
    container: {
        marginTop: 64,
        width: "100%"
    }
});

class EntryPage extends Component {

    constructor(...args) {
        super(...args);
        this.hasUpdatedTitle = false;
    }

    componentDidMount() {
        if (!this.hasUpdatedTitle && this.props.title && this.props.title.length > 0) {
            this.hasUpdatedTitle = true;
            Actions.refresh({ title: this.props.title });
        }
    }

    render() {
        return (
            <View style={styles.container}>

            </View>
        );
    }

}

EntryPage.propTypes = {
    title:              PropTypes.string.isRequired
};

export default EntryPage;
