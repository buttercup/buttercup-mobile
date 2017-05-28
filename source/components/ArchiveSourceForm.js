import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import {
    FormInput,
    FormLabel
} from "react-native-elements";
import PropTypes from "prop-types";

class ArchiveSourceForm extends Component {

    render() {
        switch (this.props.archiveType) {
            case "webdav":
                return this.renderWebDAV();

            default:
                throw new Error(`Unknown type: ${this.props.archiveType}`);
        }
    }

    renderWebDAV() {
        return (
            <View>
                <FormLabel>Remote URL</FormLabel>
                <FormInput />
            </View>
        );
    }

}

ArchiveSourceForm.propTypes = {
    archiveType:            PropTypes.string
};

export default ArchiveSourceForm;
