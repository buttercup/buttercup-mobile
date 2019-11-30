import React, { PureComponent } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
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
        borderTopWidth: 0.5,
        marginTop: 8
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
        otpCodes: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    state = {
        codes: []
    };

    interval = null;

    componentDidMount() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = null;
    }

    renderCodeItem({ entryID, entryTitle, title, otpURL, digits, period, timeLeft }, index) {
        return (
            <TouchableHighlight
                key={`${entryID}:${otpURL}`}
                onPress={() => this.props.copyToClipboard(title, digits)}
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
                            <Text style={styles.code}>{splitDigits(digits)}</Text>
                        </View>
                    </View>
                    <View>
                        <ProgressWheel
                            size={30}
                            width={5}
                            progress={(timeLeft / period) * 100}
                            color="#24B5AB"
                            backgroundColor="#ededed"
                        />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Choose>
                    <When condition={this.state.codes.length > 0}>
                        <ScrollView>
                            {this.state.codes.map((item, idx) => this.renderCodeItem(item, idx))}
                        </ScrollView>
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

    update() {
        const { otpCodes, navigation } = this.props;

        if (otpCodes.length <= 0 || !navigation.isFocused()) {
            return;
        }

        this.setState({
            codes: otpCodes.map(codeItem => {
                const totp = codeItem.totp;
                const period = totp.period;
                return {
                    ...codeItem,
                    totp,
                    period,
                    digits: totp.generate(),
                    timeLeft: period - (Math.floor(Date.now() / 1000) % period)
                };
            })
        });
    }
}
