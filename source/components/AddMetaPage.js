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

    componentWillUnmount() {
        this.props.onUnmount();
    }

    handleKeyChange(key) {
        this.props.setMetaValues(key, this.props.metaValue);
    }

    handleValueChange(value) {
        this.props.setMetaValues(this.props.metaKey, value);
    }

    render() {
        return (
            <View style={styles.container}>
                <CellGroup>
                    <CellInput
                        key="key"
                        title="Name"
                        value={this.props.metaKey}
                        onChangeText={text => this.handleKeyChange(text)}
                        />
                    <CellInput
                        key="value"
                        title="Value"
                        value={this.props.metaValue}
                        onChangeText={text => this.handleValueChange(text)}
                        />
                </CellGroup>
            </View>
        );
    }

}

AddMetaPage.propTypes = {
    metaKey:                    PropTypes.string,
    metaValue:                  PropTypes.string,
    onUnmount:                  PropTypes.func,
    setMetaValues:              PropTypes.func.isRequired
};

AddMetaPage.defaultProps = {
    metaKey:                    "",
    metaValue:                  "",
    onUnmount:                  () => {}
};

export default AddMetaPage;
