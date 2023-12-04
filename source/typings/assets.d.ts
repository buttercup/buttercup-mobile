declare module "*.svg" {
    import Svg from "react-native-svg";
    const content: Svg;
    export default content;
}

declare module "*.png" {
    const value: import("react-native").ImageSourcePropType;
    export default value;
}
