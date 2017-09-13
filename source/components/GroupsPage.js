import React, { Component } from "react";
import {
    Button,
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";
import {
    Cell,
    CellGroup
} from "react-native-cell-components";

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class GroupsPage extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: `${params.title}`,
            headerRight: (
                <Button
                    title="Add"
                    onPress={() => {}}
                    />
            )
        };
    };

    static propTypes = {
        onGroupPress: PropTypes.func.isRequired
    };

    render() {
        return (
            <View style={styles.container}>
                <CellGroup>
                    {this.props.group.groups.map(group =>
                        <Cell
                            key={group.id}
                            onPress={() => this.props.onGroupPress(group.id, group.title)}
                        >
                            <Text>{group.title}</Text>
                        </Cell>
                    )}
                </CellGroup>
            </View>
        );
    }

}

export default GroupsPage;
