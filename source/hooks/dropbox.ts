import { useCallback, useEffect, useMemo, useState } from "react";
import { getEmitter } from "../services/dropbox";

export function useDropboxToken(): string | null {
    const [token, setToken] = useState<string>(null);
    const emitter = useMemo(getEmitter, []);
    const onToken = useCallback((payload: { token: string }) => {
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
