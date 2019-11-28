import React, { Component } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import PropTypes from "prop-types";
import * as OTPAuth from "otpauth";
import ProgressWheel from "react-native-progress-wheel";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemContainerView: {
        flex: 1,
        flexDirection: "row",
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
    description: {
        fontSize: 11
    },
    code: {
        fontSize: 30,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace"
    }
});

function splitDigits(digits) {
    return digits.length === 6
        ? `${digits.slice(0, 3)} ${digits.slice(3, 6)}`
        : digits.length === 8
        ? `${digits.slice(0, 4)} ${digits.slice(4, 8)}`
        : digits;
}

export default class CodesPage extends Component {
    static navigationOptions = {
        title: "Codes"
    };

    static propTypes = {
        otpCodes: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    interval = null;

    state = {
        codes: []
    };

    componentDidMount() {
        this.setState(
            {
                codes: this.props.otpCodes.map(otpCodeItem => ({
                    ...otpCodeItem,
                    period: 30,
                    timeLeft: 30,
                    digits: "",
                    totp: null
                }))
            },
            () => {
                this.interval = setInterval(() => this.update(), 1000);
                this.update();
            }
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = null;
    }

    renderCodeItem({ entryID, title, otpURL, digits, period, timeLeft }, index) {
        return (
            <TouchableHighlight key={`${entryID}:${otpURL}`}>
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
                        <Text style={styles.description}>{title}</Text>
                        <View style={styles.codeView}>
                            <Text style={styles.code}>{splitDigits(digits)}</Text>
                        </View>
                    </View>
                    <View>
                        <ProgressWheel
                            size={46}
                            width={5}
                            progress={(timeLeft / period) * 100}
                            color={"#24B5AB"}
                            backgroundColor={"#FFF"}
                        />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.codes.map((item, idx) => this.renderCodeItem(item, idx))}
                </ScrollView>
            </View>
        );
    }

    update() {
        if (this.props.otpCodes.length <= 0 || !this.props.navigation.isFocused()) {
            return;
        }
        const updatedItems = this.state.codes.map(codeItem => {
            const totp = codeItem.totp || OTPAuth.URI.parse(codeItem.otpURL);
            const period = totp.period;
            return {
                ...codeItem,
                totp,
                period,
                digits: totp.generate(),
                timeLeft: period - (Math.floor(Date.now() / 1000) % period)
            };
        });
        this.setState({
            codes: updatedItems
        });
    }
}
