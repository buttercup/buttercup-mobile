import { VaultSourceID } from "buttercup";
import { useEffect, useMemo, useState } from "react";
import { VaultConfiguration, getEmitter, getVaultConfig } from "../services/config";

export function useVaultConfiguration(sourceID: VaultSourceID): VaultConfiguration {
    const [config, setConfig] = useState<VaultConfiguration>(getVaultConfig(sourceID));
    const emitter = useMemo(getEmitter, []);
    useEffect(() => {
        emitter.on(`update:${sourceID}`, setConfig);
        return () => {
            emitter.off(`update:${sourceID}`, setConfig);
        };
    }, [emitter, sourceID]);
    return config;
}
