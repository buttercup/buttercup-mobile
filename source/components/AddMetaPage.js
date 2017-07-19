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
        marginTop: 64,
        width: "100%"
    }
});

class AddMetaPage extends Component {

    constructor(props, ...params) {
        super(props, ...params);
        this.state = {
            key: props.key,
            value: props.value
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <CellGroup>
                    <CellInput
                        key="key"
                        title="Name"
                        value={this.state.key}
                        onChangeText={text => this.setState({ key: text })}
                        />
                    <CellInput
                        key="value"
                        title="Value"
                        value={this.state.value}
                        onChangeText={text => this.setState({ value: text })}
                        />
                </CellGroup>
            </View>
        );
    }

}

AddMetaPage.propTypes = {
    key:                        PropTypes.string,
    value:                      PropTypes.string
};

AddMetaPage.defaultProps = {
    key:                        "",
    value:                      ""
};

export default AddMetaPage;
