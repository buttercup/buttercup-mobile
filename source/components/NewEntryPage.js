import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";
import {
    CellGroup,
    CellInput
} from "react-native-cell-components";

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class NewEntryPage extends Component {

    handleValueChange(key, value) {
        this.props.setPropertyValue(key, value);
    }

    render() {
        return (
            <View style={styles.container}>
                <CellGroup>
                    <CellInput
                        key="title"
                        title="Title"
                        value={this.props.title}
                        onChangeText={text => this.handleValueChange("title", text)}
                        />
                    <CellInput
                        key="username"
                        title="Username"
                        value={this.props.username}
                        onChangeText={text => this.handleValueChange("username", text)}
                        />
                    <CellInput
                        key="password"
                        title="Password"
                        value={this.props.password}
                        onChangeText={text => this.handleValueChange("password", text)}
                        />
                </CellGroup>
            </View>
        );
    }

}

NewEntryPage.propTypes = {
    password:                   PropTypes.string.isRequired,
    setPropertyValue:           PropTypes.func.isRequired,
    title:                      PropTypes.string.isRequired,
    username:                   PropTypes.string.isRequired
};

export default NewEntryPage;
