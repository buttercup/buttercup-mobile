import { useColorScheme } from "react-native";

export function useAppearance(): "dark" | "light" {
    const systemScheme = useColorScheme();
    return systemScheme;
}
