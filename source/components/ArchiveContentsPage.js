import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
        marginTop: 64
    }
    // menuList: {
    //     marginBottom: 20,
    //     width: "100%"
    // }
});

class ArchiveContentsPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                {Object.values(this.props.groups).map(title =>
                    <Text>{title}</Text>
                )}
            </View>
        );
    }

}

ArchiveContentsPage.propTypes = {
    groups:               PropTypes.object.isRequired
};

// ArchiveContentsPage.defaultProps = {
//     stage:                      "chooseType"
// };

export default ArchiveContentsPage;
