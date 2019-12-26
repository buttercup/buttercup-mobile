import * as React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { HeaderButtons as HeaderButtonsBase, HeaderButton } from "react-navigation-header-buttons";

// define IconComponent, color, sizes and OverflowIcon in one place
const MaterialHeaderButton = props => (
    <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="#454545" />
);

export const HeaderButtons = props => {
    return (
        <HeaderButtonsBase
            HeaderButtonComponent={MaterialHeaderButton}
            OverflowIcon={<MaterialIcons name="more-vert" size={23} color="#454545" />}
            {...props}
        />
    );
};
export { Item } from "react-navigation-header-buttons";
