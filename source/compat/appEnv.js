import gzip from "gzip-js";
import { createClient } from "webdav/web";
import { getSharedAppEnv } from "../library/buttercupCore.js";
import { getPatchedCrypto } from "./crypto.js";

let __hasInitialised = false,
    __derivationRoundsOverride = null;

/**
 * Compress text using GZIP
 * @param {String} text The text to compress
 * @returns {String} Compressed text
 */
function compress(text) {
    const compressed = gzip.zip(text, {
        level: 9,
        timestamp: parseInt(Date.now() / 1000, 10)
    });
    const compressedLength = compressed.length;
    let outputText = "";
    for (let i = 0; i < compressedLength; i += 1) {
        outputText += String.fromCharCode(compressed[i]);
    }
    return outputText;
}

/**
 * Decompress a compressed string (GZIP)
 * @param {String} text The compressed text
 * @returns {String} Decompressed text
 */
function decompress(text) {
    var compressedData = [],
        textLen = text.length;
    for (var i = 0; i < textLen; i += 1) {
        compressedData.push(text.charCodeAt(i));
    }
    const decompressedData = gzip.unzip(compressedData);
    const decompressedLength = decompressedData.length;
    let outputText = "";
    for (let j = 0; j < decompressedLength; j += 1) {
        outputText += String.fromCharCode(decompressedData[j]);
    }
    return outputText;
}

function decryptData(data, password) {
    const session = getPatchedCrypto();
    return session.decrypt(data, password);
}

function encryptData(data, password) {
    const session = getPatchedCrypto();
    if (__derivationRoundsOverride > 0) {
        session.setDerivationRounds(__derivationRoundsOverride);
    }
    return session.encrypt(data, password);
}

export function initButtercupCore() {
    if (__hasInitialised) return;
    __hasInitialised = true;
    // Setup app env
    const appEnv = getSharedAppEnv();
    // Apply methods
    appEnv.setProperties({
        "compression/v1/compressText": compress,
        "compression/v1/decompressText": decompress,
        "crypto/v1/decryptBuffer": decryptData,
        "crypto/v1/encryptBuffer": encryptData,
        "crypto/v1/decryptText": decryptData,
        "crypto/v1/encryptText": encryptData,
        "crypto/v1/setDerivationRounds": setDerivationRounds,
        "net/webdav/v1/newClient": createClient
    });
}

function setDerivationRounds(rounds = null) {
    __derivationRoundsOverride = rounds;
}
