import React, { Component } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {
    List,
    ListItem
} from "react-native-elements";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        marginTop: 64
    },
    scrollContainer: {
        height: "100%",
        width: "100%"
    }
    // container: {
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "stretch",
    //     backgroundColor: "transparent",
    //     marginTop: 64
    // },
    // fileList: {
    //     width: "100%",
    //     flex: 1,
    //     justifyContent: "flex-start",
    //     alignItems: "stretch"
    // }
});

class RemoteExplorer extends Component {

    componentDidMount() {
        this.props.onPathSelected("");
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView styles={styles.scrollContainer}>
                    <List>
                        {this.props.items.map(item => this.renderItem(item))}
                    </List>
                </ScrollView>
            </View>
        );
    }

    renderItem(item) {
        const image = item.isDir ?
            "https://opengameart.org/sites/default/files/Flat%20Folder%20icon.png" :
            "http://www.iconeasy.com/icon/png/File%20Type/Slika%201.0%20Location%20Icons/Location%20%20%20FILE.png";
        return (
            <ListItem
                key={item.name}
                title={item.name}
                avatar={{ uri: image }}
                onPress={() => this.props.onPathSelected(item.path)}
                />
        );
    }

}

RemoteExplorer.propTypes = {
    items:                      PropTypes.array.isRequired,
    loading:                    PropTypes.bool.isRequired,
    onPathSelected:             PropTypes.func.isRequired,
    remoteDirectory:            PropTypes.string.isRequired
};

RemoteExplorer.defaultProps = {
    items:                      [],
    loading:                    false,
    remoteDirectory:            "/"
};

export default RemoteExplorer;
