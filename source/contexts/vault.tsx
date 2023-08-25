import { useEffect, useState } from "react";
import { VaultSourceID } from "buttercup";
import React, { useMemo } from "react";
import { ChildElements } from "../types";
import { getVaultSource } from "../services/buttercup";

interface IVaultContext {
    readOnly: boolean;
    sourceID: VaultSourceID;
}

interface VaultProviderProps {
    children: ChildElements;
    sourceID: VaultSourceID;
}

export const VaultContext = React.createContext<IVaultContext>({} as IVaultContext);

export function VaultProvider(props: VaultProviderProps) {
    const { sourceID } = props;
    const [readOnly, setReadOnly] = useState<boolean>(false);
    // Init
    useEffect(() => {
        if (!sourceID) return;
        let mounted = true;
        const source = getVaultSource(sourceID);
        if (!source) return;
        setReadOnly(source?.vault?.format.readOnly);
        return () => {
            mounted = false;
        };
    }, [sourceID]);
    // Build context
    const context: IVaultContext = useMemo(
        () => ({
            readOnly,
            sourceID
        }),
        [readOnly, sourceID]
    );
    return <VaultContext.Provider value={context}>{props.children}</VaultContext.Provider>;
}
