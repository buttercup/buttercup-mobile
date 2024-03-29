package com.buttercup;

import org.spongycastle.util.encoders.Base64;

import java.util.Random;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.Mac;

/**
 * Created by perry on 10/10/17.
 */

public class BCCrypto {

    public static final int IV_BYTE_LEN = 16;
    private static final String RANDOM_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY0123456789!@#$%^&*(){}[]<>,.?~|-=_+";

    public static String decryptText(String encryptedText, String keyHex, String ivHex, String saltHex, String hmacKeyHex, String hmacHex) throws Exception {
        byte[] encryptedData = Base64.decode(encryptedText); // In base64
        byte[] keyData = BCHelpers.hexStringToByteArray(keyHex);
        byte[] ivData = BCHelpers.hexStringToByteArray(ivHex);
        byte[] hmacKeyData = BCHelpers.hexStringToByteArray(hmacKeyHex);
        IvParameterSpec iv = new IvParameterSpec(ivData);
        SecretKeySpec skeySpec = new SecretKeySpec(keyData, "AES");
        // HMAC verification
        Mac sha256HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec hmacSecretKey = new SecretKeySpec(hmacKeyData, "HmacSHA256");
        sha256HMAC.init(hmacSecretKey);
        String hmacTarget = encryptedText + ivHex + saltHex;
        byte[] hmacData = sha256HMAC.doFinal(hmacTarget.getBytes(StandardCharsets.UTF_8));
        String newHmacHex = BCHelpers.byteArrayToHexString(hmacData);
        if (!newHmacHex.equals(hmacHex)) {
            throw new Exception("Authentication failed - possible tampering");
        }
        // AES decryption
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
        cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
        byte[] decrypted = cipher.doFinal(encryptedData);
        // return new String(decrypted, "UTF8");
        byte[] encodedDecryptedText = Base64.encode(decrypted); // Out base64
        return new String(encodedDecryptedText);
    }

    public static String encryptText(String b64Text, String keyHex, String saltHex, String ivHex, String hmacHexKey) throws Exception {
        String text = BCHelpers.base64ToString(b64Text); // In base64
        byte[] ivData = BCHelpers.hexStringToByteArray(ivHex);
        byte[] keyData = BCHelpers.hexStringToByteArray(keyHex);
        byte[] hmacKeyData = BCHelpers.hexStringToByteArray(hmacHexKey);
        IvParameterSpec iv = new IvParameterSpec(ivData);
        SecretKeySpec skeySpec = new SecretKeySpec(keyData, "AES");
        // AES encryption
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
        byte[] encrypted = cipher.doFinal(text.getBytes());
        byte[] encodedEncryptedText = Base64.encode(encrypted); // Out base64
        String encryptedText = new String(encodedEncryptedText);
        // HMAC
        Mac sha256HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec hmacSecretKey = new SecretKeySpec(hmacKeyData, "HmacSHA256");
        sha256HMAC.init(hmacSecretKey);
        String hmacTarget = encryptedText + ivHex + saltHex;
        byte[] hmacData = sha256HMAC.doFinal(hmacTarget.getBytes(StandardCharsets.UTF_8));
        String hmacHex = BCHelpers.byteArrayToHexString(hmacData);
        // Output
        return encryptedText + "|" + hmacHex + "|" + ivHex + "|" + saltHex;
    }

    public static String generateIV() throws Exception {
        int targetLength = IV_BYTE_LEN * 2;
        String randomText = generateRandomString(targetLength);
        String hex = String.format("%040x", new BigInteger(1, randomText.getBytes(StandardCharsets.UTF_8)));
        String iv = hex.substring(0, targetLength).toLowerCase();
        if (iv.length() != targetLength) {
            throw new Exception("IV length mismatch");
        }
        return iv;
    }

    public static String generateRandomString(int length) {
        StringBuilder randomString = new StringBuilder();
        Random rnd = new Random();
        while (randomString.length() < length) { // length of the random string.
            int index = (int) (rnd.nextFloat() * RANDOM_CHARS.length());
            randomString.append(RANDOM_CHARS.charAt(index));
        }
        return randomString.toString();
    }

    public static String generateSalt(int length) {
        String randomText = generateRandomString(length * 2);
        String hex = String.format("%040x", new BigInteger(1, randomText.getBytes(StandardCharsets.UTF_8)));
        return hex.substring(0, length).toLowerCase();
    }

}
