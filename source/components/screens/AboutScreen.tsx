import React, { useCallback } from "react";
import { Linking, Platform, SafeAreaView, View } from "react-native";
import {
    Avatar,
    Button,
    Card,
    Divider,
    Icon,
    Layout,
    StyleService,
    Text,
    TopNavigation,
    TopNavigationAction,
    useStyleSheet
} from "@ui-kitten/components";
import { version } from "../../../package.json";

const BCUP_ICON = require("../../../resources/images/bcup-256.png");
const { MONO_FONT } = Platform.select({
    ios: {
        MONO_FONT: "Courier New"
    },
    android: {
        MONO_FONT: "monospace"
    }
});

const BackIcon = props => <Icon {...props} name="arrow-back" />;

const themedStyles = StyleService.create({
    card: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "94%"
    },
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 12
    },
    heading: {
        textAlign: "center"
    },
    logo: {},
    logoContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    },
    paragraph: {
        marginTop: 10
    },
    version: {
        fontFamily: MONO_FONT,
        textAlign: "center"
    }
});

export function AboutScreen({ navigation }) {
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    const handleButtercupButtonPress = useCallback(() => {
        Linking.openURL("https://buttercup.pw");
    }, []);
    const styles = useStyleSheet(themedStyles);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation title="About" alignment="center" accessoryLeft={BackAction} />
            <Divider />
            <Layout level="2" style={styles.container}>
                <Card
                    header={props => (
                        <View {...props}>
                            <View style={styles.logoContainer}>
                                <Avatar
                                    shape="square"
                                    size="large"
                                    source={BCUP_ICON}
                                    style={styles.logo}
                                />
                            </View>
                            <Text category="h4" style={styles.heading}>Buttercup</Text>
                            <Text category="s1" style={styles.version}>v{version}</Text>
                        </View>
                    )}
                    footer={props => (
                        <View {...props}>
                            <Button onPress={handleButtercupButtonPress}>
                                Buttercup Apps
                            </Button>
                        </View>
                    )}
                    style={styles.card}
                >
                    <Text category="p1">
                        Buttercup Password Manager is a cross-platform application suite that provides secure vault access for storing login credentials and other secret information.
                    </Text>
                    <Text category="p1" style={styles.paragraph}>
                        Compliment this mobile app with the Desktop application and Browser Extension, available below.
                    </Text>
                </Card>
            </Layout>
        </SafeAreaView>
    );
}
