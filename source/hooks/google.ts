import { useCallback, useEffect, useMemo, useState } from "react";
import { getEmitter } from "../services/google";
import { GoogleOAuthToken } from "../types";

export function useGoogleToken(): GoogleOAuthToken | null {
    const [token, setToken] = useState<GoogleOAuthToken>(null);
    const emitter = useMemo(getEmitter, []);
    const onToken = useCallback((payload: { token: GoogleOAuthToken }) => {
        if (payload?.token) setToken(payload.token);
    }, []);
    useEffect(() => {
        emitter.on("token", onToken);
        return () => {
            emitter.off("token", onToken);
        };
    }, [emitter]);
    return token;
}
