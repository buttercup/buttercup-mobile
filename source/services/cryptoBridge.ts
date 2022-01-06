import { NativeModules } from "react-native";

export interface CryptoBridgeInterface {
    decryptText(
        encryptedText: string,
        key: string,
        ivHex: string,
        salt: string,
        hmacHexKey: string,
        hmacHex: string
    ): Promise<string>;
    deriveKeyFromPassword(
        password: string,
        salt: string,
        rounds: number,
        bits: number
    ): Promise<string>;
    encryptText(
        text: string,
        key: string,
        salt: string,
        iv: string,
        hmacHexKey: string
    ): Promise<string>;
    generateIV(): Promise<string>;
    generateSaltWithLength(length: number): Promise<string>;
}

const { CryptoBridge } = NativeModules as { CryptoBridge: CryptoBridgeInterface };

export { CryptoBridge };
