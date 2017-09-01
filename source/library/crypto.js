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
    // // Extract the components
    // console.log("DEC", encryptedComponents, keyDerivationInfo);
    // const encryptedContent = encryptedComponents.content;
    // // const iv = Buffer.from(encryptedComponents.iv, "hex");
    // const iv = new Buffer(encryptedComponents.iv, "hex");
    // const salt = encryptedComponents.salt;
    // const hmacData = encryptedComponents.hmac;
    // // Get HMAC tool
    // const hmacTool = createHmac(HMAC_ALGO, keyDerivationInfo.hmac);
    // // Generate the HMAC
    // console.log("Before hmac");
    // hmacTool.update(encryptedContent);
    // hmacTool.update(encryptedComponents.iv);
    // hmacTool.update(salt);
    // const newHmaxHex = hmacTool.digest("hex");
    // // Check hmac for tampering
    // if (constantTimeCompare(hmacData, newHmaxHex) !== true) {
    //     throw new Error("Authentication failed while decrypting content");
    // }
    // // Decrypt
    // console.log("Before decipher");
    // const decryptTool = createDecipheriv(ENCRYPTION_ALGO, keyDerivationInfo.key, iv);
    // const decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
    // console.log("Before result");
    // const res = decryptedText + decryptTool.final("utf8");
    // console.log("DOne.");
    // return res;
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
        console.log("SEND", [
            text,
            keyDerivationInfo.key.toString("hex"),
            keyDerivationInfo.salt,
            keyDerivationInfo.hmac.toString("hex")
        ]);
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
                console.log({
                    hmac,
                    iv,
                    salt,
                    rounds: keyDerivationInfo.rounds,
                    encryptedContent
                });
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
    // const iv = generateIV();
    // const encryptTool = createCipheriv(ENCRYPTION_ALGO, keyDerivationInfo.key, iv);
    // const hmacTool = createHmac(HMAC_ALGO, keyDerivationInfo.hmac);
    // const salt = keyDerivationInfo.salt.toString("hex");
    // const pbkdf2Rounds = keyDerivationInfo.rounds;
    // // Perform encryption
    // let encryptedContent = encryptTool.update(text, "utf8", "base64");
    // encryptedContent += encryptTool.final("base64");
    // // Generate hmac
    // hmacTool.update(encryptedContent);
    // hmacTool.update(ivHex);
    // hmacTool.update(saltHex);
    // const hmacHex = hmacTool.digest("hex");
    // return {
    //     hmac: hmacHex,
    //     iv: ivHex,
    //     salt: saltHex,
    //     rounds: pbkdf2Rounds,
    //     encryptedContent
    // };
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
