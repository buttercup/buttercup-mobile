package com.buttercup;

public class Crypto {
    private static native String decryptCBC(
            String encryptedText,
            String keyHex,
            String ivHex,
            String salt,
            String hmacKeyHex,
            String hmacHex
    );
    private static native String deriveKeyFromPassword(String password, String salt, int rounds, int bits);
    private static native String encryptCBC(
            String encodedText,
            String keyHex,
            String salt,
            String ivHex,
            String hmacKeyHex
    );
    private static native String generateRandomBytes();
    private static native String generateSalt(int length);
    private static native String generateUUIDList(int count);

    static {
        System.loadLibrary("crypto");
    }

    public static String decryptText(
            String encryptedText,
            String keyHex,
            String ivHex,
            String salt,
            String hmacKeyHex,
            String hmacHex
    ) {
        return Crypto.decryptCBC(
                encryptedText,
                keyHex,
                ivHex,
                salt,
                hmacKeyHex,
                hmacHex
        );
    }

    public static String encryptText(
            String encodedText,
            String keyHex,
            String salt,
            String ivHex,
            String hmacKeyHex
    ) {
        return Crypto.encryptCBC(
                encodedText,
                keyHex,
                salt,
                ivHex,
                hmacKeyHex
        );
    }

    public static String generateIV() {
        String ivHex = Crypto.generateRandomBytes();
        return ivHex.length() > 0 ? ivHex : null;
    }

    public static String generateSaltWithLength(int length) {
        String salt = Crypto.generateSalt(length);
        return salt.length() > 0 ? salt : null;
    }


    public static String generateUUIDs(int count) {
        String uuids = count > 0 ? Crypto.generateUUIDList(count) : "";
        return uuids.length() > 0 ? uuids : null;
    }

    public static String pbkdf2(String password, String salt, int rounds, int bits) {
        String derivationHex = Crypto.deriveKeyFromPassword(password, salt, rounds, bits);
        return derivationHex.length() > 0 ? derivationHex : null;
    }
}
