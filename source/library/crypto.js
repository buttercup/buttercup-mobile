import { NativeModules } from "react-native";
import {
    createCipheriv,
    createDecipheriv,
    createHmac,
    randomBytes
} from "crypto";
import {
    vendor,
    Web
} from "buttercup-web";

const { CryptoBridge } = NativeModules;

const ENCRYPTION_ALGO = "aes-256-cbc";
const HMAC_ALGO = "sha256";

function constantTimeCompare(val1, val2) {
    let sentinel;
    if (val1.length !== val2.length) {
        return false;
    }
    for (let i = 0; i <= (val1.length - 1); i += 1) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }
    return sentinel === 0;
}

function decrypt(encryptedComponents, keyDerivationInfo) {
    const callBridge = (new Promise(function(resolve, reject) {
        CryptoBridge.decryptText(
            encryptedComponents.content,
            keyDerivationInfo.key.toString("hex"),
            encryptedComponents.iv,
            encryptedComponents.salt,
            keyDerivationInfo.hmac.toString("hex"),
            encryptedComponents.hmac,
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (/^Error/i.test(result)) {
                    let errorMessage = "Unknown decrypt error";
                    const errorCodeMatch = /^Error=([0-9-]+)/i.exec(result);
                    const errorMessageMatch = /^Error:(.+)/i.exec(result);
                    if (errorCodeMatch) {
                        errorMessage = `Error code ${errorCodeMatch[1]}`;
                    } else if (errorMessageMatch) {
                        errorMessage = errorMessageMatch[1];
                    }
                    return reject(new Error(errorMessage));
                }
                return resolve(result);
            }
        );
    }));
    return callBridge;
}

export function deriveKeyNatively(password, salt, rounds) {
    const callBridge = (new Promise(function(resolve, reject) {
        CryptoBridge.deriveKeyFromPassword(password, salt, rounds, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    }));
    return callBridge
        .then(derivedKeyHex => hexKeyToBuffer(derivedKeyHex));
}

function encrypt(text, keyDerivationInfo) {
    const callBridge = (new Promise(function(resolve, reject) {
        CryptoBridge.encryptText(
            text,
            keyDerivationInfo.key.toString("hex"),
            keyDerivationInfo.salt,
            keyDerivationInfo.hmac.toString("hex"),
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (/^Error/i.test(result)) {
                    let errorMessage = "Unknown encrypt error";
                    const errorCodeMatch = /^Error=([0-9-]+)/i.exec(result);
                    const errorMessageMatch = /^Error:((.|\n)+)/i.exec(result);
                    if (errorCodeMatch) {
                        errorMessage = `Error code ${errorCodeMatch[1]}`;
                    } else if (errorMessageMatch) {
                        errorMessage = errorMessageMatch[1];
                    }
                    return reject(new Error(errorMessage));
                }
                // Process result
                const [
                    encryptedContent,
                    hmac,
                    iv,
                    salt
                ] = result.split("|");
                return resolve({
                    hmac,
                    iv,
                    salt,
                    rounds: keyDerivationInfo.rounds,
                    encryptedContent
                });
            }
        );
    }));
    return callBridge;
}

function generateIV() {
    return Buffer
        .from(randomBytes(16))
        .toString("hex");
}

function generateSalt(length) {
    const genLen = length % 2 ? length + 1 : length;
    return randomBytes(genLen / 2)
        .toString("hex")
        .substring(0, length);
}

export function hexKeyToBuffer(key) {
    let hexKey = key;
    const hexArr = [];
    while (hexKey.length > 0) {
        const piece = hexKey.substr(0, 2);
        hexKey = hexKey.substr(2);
        hexArr.push(piece);
    }
    const intArr = Uint8Array.from(hexArr, function(byte) {
        return parseInt(byte, 16);
    });
    const buff = intArr.buffer;
    // fix broken things
    buff.length = intArr.length;
    const oldToString = buff.toString;
    buff.toString = function(mode) {
        if (mode === "hex") {
            return key;
        }
        return oldToString.call(buff, mode);
    };
    return buff;
}

export function patchCrypto() {
    const { iocane } = vendor;
    iocane.components.setEncryptTool(encrypt);
    iocane.components.setDecryptTool(decrypt);
}

export function patchKeyDerivation() {
    Web.HashingTools.patchCorePBKDF(
        (password, salt, rounds, bits /* , algorithm */) =>
            deriveKeyNatively(password, salt, rounds)
    );
}
