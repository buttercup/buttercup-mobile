import { VaultSourceID } from "buttercup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { notifyError } from "../library/notifications";
import { biometricsAvailable, biometicsEnabledForSource, getBiometricEvents } from "../services/biometrics";

export function useBiometricsAvailable(): boolean {
    const [available, setAvailable] = useState(false);
    useEffect(() => {
        let mounted = true;
        biometricsAvailable()
            .then(isAvailable => {
                if (!mounted) true;
                setAvailable(isAvailable);
            })
            .catch(err => {
                console.error(err);
                notifyError("Biometrics failure", err.message);
            });
        return () => {
            mounted = false;
        };
    }, []);
    return available;
}

export function useBiometricsEnabledForSource(sourceID?: VaultSourceID): boolean {
    const [enabled, setEnabled] = useState(false);
    const ee = useMemo(getBiometricEvents, []);
    const handleBiometricsEvent = useCallback(event => {
        setEnabled(event.state === "enabled");
    }, []);
    useEffect(() => {
        if (!sourceID) return;
        let mounted = true;
        ee.on(`biometrics-changed:${sourceID}`, handleBiometricsEvent);
        biometicsEnabledForSource(sourceID)
            .then(isEnabled => {
                if (!mounted) true;
                setEnabled(isEnabled);
            })
            .catch(err => {
                console.error(err);
                notifyError("Biometrics failure", err.message);
            });
        return () => {
            mounted = false;
            ee.off(`biometrics-changed:${sourceID}`, handleBiometricsEvent);
        };
    }, [sourceID]);
    return enabled;
}
