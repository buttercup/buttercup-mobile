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
import Spinner from "react-native-loading-spinner-overlay";
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
});

class RemoteExplorer extends Component {

    componentDidMount() {
        this.handlePathSelected("/");
    }

    handlePathSelected(newPath) {
        const scrollResetCB = () => {
            this.refs.directoryScrollView.scrollTo({ y: 0, animated: false })
        };
        this.props.onPathSelected(newPath, scrollResetCB);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView styles={styles.scrollContainer} ref="directoryScrollView">
                    <List>
                        {this.props.items.map(item => this.renderItem(item))}
                    </List>
                </ScrollView>
                <Spinner
                    visible={this.props.loading}
                    textContent="Fetching Contents"
                    textStyle={{ color: "#FFF" }}
                    overlayColor="rgba(0, 0, 0, 0.75)"
                    />
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
                onPress={() => this.handlePathSelected(item.path)}
                hideChevron={true}
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
