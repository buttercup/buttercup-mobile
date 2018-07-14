package com.buttercup;

import org.junit.Test;
import org.junit.runner.RunWith;

import android.support.test.runner.AndroidJUnit4;
import android.util.Base64;

import static org.junit.Assert.*;
import java.util.regex.*;

@RunWith(AndroidJUnit4.class)
public class CryptoTest {
    private static final String PASSWORD = "mySecretPassw0rd";
    private static final int ROUNDS = 212032;
    private static final String SALT = "#j8P.3Fv9";
    private static final int BITS = 512;
    private static final String KEY_HEX = "6a7049fac02d3458a2596624664c9f382a259d98254678b49493cb6d6c645ef9";
    private static final String IV_HEX = "71c424dd64f6143749705f0d7a2b0ff1";
    private static final String HMAC_KEY_HEX = "5cce008ec5c7d7f98e7869a6627b37888d029a70c15b7fbca257c7891a94b14e";

    private static final String HEX_REXP = "^([a-f0-9]+|[A-F0-9]+)$";
    private static final String UUID_REXP = "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$";

    @Test
    public void encryptText_encryptedTextDoesNotContainOriginal() throws Exception {
        byte[] data = "Original Text".getBytes("UTF-8");
        String someText = Base64.encodeToString(data, Base64.DEFAULT);
        System.out.println("This is cool2: " + someText);
        String encrypted = Crypto.encryptText(
                someText,
                KEY_HEX,
                SALT,
                IV_HEX,
                HMAC_KEY_HEX
        );
        System.out.println("This is cool: " + encrypted);
        assertFalse(encrypted.contains("Original Text"));
        assertFalse(encrypted.contains(someText));
    }

    @Test
    public void encryptText_encryptedTextIsNotEmpty() throws Exception {
        String encrypted = Crypto.encryptText("abcdefghij", KEY_HEX, SALT, IV_HEX, HMAC_KEY_HEX);
        assertTrue(encrypted.length() > 10);
    }

    @Test
    public void generateIV_generatesCorrectLengthIVs() throws Exception {
        String iv = Crypto.generateIV();
        // 32 chars = 16 bytes of hex
        assertEquals(32, iv.length());
    }

    @Test
    public void generateIV_generatesHexadecimal() throws Exception {
        String iv = Crypto.generateIV();
        assertTrue(Pattern.matches(HEX_REXP, iv));
    }

    @Test
    public void generateSaltWithLength_generatesCorrectLengthSalts() throws Exception {
        String salt = Crypto.generateSaltWithLength(37);
        assertEquals(37, salt.length());
    }

    @Test
    public void generateUUIDs_generatesUUIDs() throws Exception {
        String outcome = Crypto.generateUUIDs(1);
        assertTrue(Pattern.matches(UUID_REXP, outcome));
    }

    @Test
    public void generateUUIDs_generatesMultipleUUIDs() throws Exception {
        String[] uuids = Crypto.generateUUIDs(8).split(",");
        assertEquals(8, uuids.length);
        for (String uuid: uuids) {
            assertTrue(Pattern.matches(UUID_REXP, uuid));
        }
    }

    @Test
    public void pbkdf2_derivesKey() throws Exception {
        String targetOutcome = "a133417d43bef4317d99ee14b20868173e42cead20d874d394c7ba6a075e8a15dc6f2fb83625c96d76c6adb7eb85f2502bca4d2052a41b050a337680b601457b";
        String outcome = Crypto.pbkdf2(PASSWORD, SALT, ROUNDS, BITS);
        assertEquals(targetOutcome, outcome);
    }
}