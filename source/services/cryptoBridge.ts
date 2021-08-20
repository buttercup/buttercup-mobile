import { NativeModules } from "react-native";

export interface CryptoBridgeInterface {
    deriveKeyFromPassword(
        password: string,
        salt: string,
        rounds: number,
        bits: number
    ): Promise<string>;
    generateSaltWithLength(length: number): Promise<string>;
    generateIV(): Promise<string>;
    encryptText(
        text: string,
        key: string,
        salt: string,
        iv: string,
        hmacHexKey: string
    ): Promise<string>;
    decryptText(
        encryptedText: string,
        key: string,
        ivHex: string,
        salt: string,
        hmacHexKey: string,
        hmacHex: string
    ): Promise<string>;
}

const { CryptoBridge } = NativeModules as { CryptoBridge: CryptoBridgeInterface };

export { CryptoBridge };
