import { NativeModules } from "react-native";

export interface AutofillBridgeInterface {
    cancelAutoFill: () => Promise<void>;
    completeAutoFill: (username: string, password: string, entryPath: string) => Promise<void>;
}

const { AutoFillBridge } = NativeModules as { AutoFillBridge: AutofillBridgeInterface };

export { AutoFillBridge };
