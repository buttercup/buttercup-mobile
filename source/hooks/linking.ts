import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";

export function useInitialURL() {
    const [url, setURL] = useState(null);
    const [processing, setProcessing] = useState(true);
    const handleURLChange = useCallback(({ url }) => {
        setURL(url);
        setProcessing(false);
    }, []);
    useEffect(() => {
        const getUrlAsync = async () => {
            // Get the deep link used to open the app
            const initialUrl = await Linking.getInitialURL();
            setURL(initialUrl);
            setProcessing(false);
        };
        getUrlAsync();
        Linking.addEventListener("url", handleURLChange);
        return () => {
            return Linking.removeEventListener("url", handleURLChange);
        };
    }, []);
    return {
        url,
        processing
    };
}
