import React, { PureComponent } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    SectionList
} from "react-native";
import PropTypes from "prop-types";
import ProgressWheel from "react-native-progress-wheel";
import { otpInstanceFromURL } from "../library/otp.js";
import EmptyView from "./EmptyView.js";

const SECURITY_SHIELD = require("../../resources/images/security-system-shield-lock.png");

const DIGIT_SEPARATOR = " ";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemContainerView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        marginHorizontal: 0,
        borderBottomColor: "#DDD",
        borderBottomWidth: 0.5,
        backgroundColor: "#FFF"
    },
    itemContainerViewFirst: {
        borderTopColor: "#DDD",
        borderTopWidth: 0.5
    },
    entryContainerView: {
        flex: 1,
        flexDirection: "column"
    },
    codeView: {
        flex: 1,
        flexDirection: "row"
    },
    entryTitle: {
        fontSize: 10,
        color: "#666"
    },
    title: {
        fontSize: 11
    },
    code: {
        fontSize: 30,
        color: "#222",
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace"
    },
    codeError: {
        color: "rgba(241, 92, 92, 0.6)"
    },
    groupTitle: {
        fontWeight: "500",
        fontSize: 12,
        textTransform: "uppercase",
        color: "#999"
    },
    groupTitleContainer: {
        paddingHorizontal: 8,
        marginTop: 8,
        marginBottom: 4
    }
});

function splitDigits(digits = "") {
    return digits.length === 6
        ? `${digits.slice(0, 3)}${DIGIT_SEPARATOR}${digits.slice(3, 6)}`
        : digits.length === 8
        ? `${digits.slice(0, 4)}${DIGIT_SEPARATOR}${digits.slice(4, 8)}`
        : digits;
}

export default class CodesPage extends PureComponent {
    static navigationOptions = {
        title: "Codes"
    };

    static propTypes = {
        copyToClipboard: PropTypes.func.isRequired,
        otpGroups: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    state = {
        groups: []
    };

    interval = null;
    focusSubscription = null;

    componentDidMount() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
        this.focusSubscription = this.props.navigation.addListener("didFocus", payload => {
            this.update();
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = null;
        this.focusSubscription.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <Choose>
                    <When condition={this.state.groups.length > 0}>
                        <SectionList
                            sections={this.state.groups}
                            renderItem={({ item, index }) => this.renderCodeItem(item, index)}
                            renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
                            keyExtractor={(item, index) => item.entryID + index}
                        />
                    </When>
                    <Otherwise>
                        <EmptyView
                            text="Unlock vaults or add codes."
                            imageSource={SECURITY_SHIELD}
                        />
                    </Otherwise>
                </Choose>
            </View>
        );
    }

    renderCodeItem({ error, entryID, entryTitle, title, otpURL, digits, period, timeLeft }, index) {
        return (
            <TouchableHighlight
                key={`${entryID}:${otpURL}`}
                onPress={() => {
                    if (!error) {
                        this.props.copyToClipboard(title, digits);
                    }
                }}
                underlayColor="white"
            >
                <View
                    style={
                        index === 0
                            ? StyleSheet.flatten([
                                  styles.itemContainerView,
                                  styles.itemContainerViewFirst
                              ])
                            : styles.itemContainerView
                    }
                >
                    <View style={styles.entryContainerView}>
                        <Text style={styles.entryTitle}>{entryTitle}</Text>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.codeView}>
                            <Choose>
                                <When condition={error}>
                                    <Text
                                        style={StyleSheet.flatten([styles.code, styles.codeError])}
                                    >
                                        ERROR
                                    </Text>
                                </When>
                                <Otherwise>
                                    <Text style={styles.code}>{splitDigits(digits)}</Text>
                                </Otherwise>
                            </Choose>
                        </View>
                    </View>
                    <View>
                        <ProgressWheel
                            size={30}
                            width={5}
                            progress={error ? 0 : (timeLeft / period) * 100}
                            color="#24B5AB"
                            backgroundColor="#ededed"
                        />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    renderSectionHeader({ sourceTitle }) {
        return (
            <View style={styles.groupTitleContainer}>
                <Text style={styles.groupTitle}>{sourceTitle}</Text>
            </View>
        );
    }

    update() {
        const { otpGroups, navigation } = this.props;
        if (otpGroups.length <= 0 || !navigation.isFocused()) {
            return;
        }
        this.setState({
            groups: otpGroups.map(group => ({
                sourceTitle: group.sourceTitle,
                key: group.sourceID,
                data: group.entries.map(codeItem => {
                    if (codeItem.error) {
                        return codeItem;
                        // return {
                        //     ...codeItem,
                        //     digits: "",
                        //     timeLeft: 0
                        // };
                    }
                    const totp = codeItem.totp;
                    const period = totp.period;
                    return {
                        ...codeItem,
                        digits: totp.generate(),
                        timeLeft: period - (Math.floor(Date.now() / 1000) % period)
                    };
                })
            }))
        });
    }
}
