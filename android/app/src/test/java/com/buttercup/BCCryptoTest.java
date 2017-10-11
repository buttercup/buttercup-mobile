package com.buttercup;

import com.buttercup.BCCrypto;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by perry on 10/10/17.
 */
public class BCCryptoTest {

    private static final String UUID_REXP = "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$";

    private static final String unencryptedText = "This is some\nraw text!! ";

    private String keyHex;
    private String saltHex;
    private String hmacKeyHex;

    @Before
    public void setUp() throws Exception {
        keyHex = BCCrypto.generateSalt(64); // random hex string
        saltHex = BCCrypto.generateSalt(15);
        hmacKeyHex = BCCrypto.generateSalt(64);
    }

    @Test
    public void encryptText_returnsCorrectStructure() {
        String encryptedBlock = BCCrypto.encryptText(unencryptedText, keyHex, saltHex, hmacKeyHex);
        String[] components = encryptedBlock.split("\\|");
        System.out.println(encryptedBlock);
        assertEquals(4, components.length);
    }

    @Test
    public void generateIV_generatesCorrectLength() throws Exception {
        String iv = BCCrypto.generateIV();
        assertEquals(32, iv.length());
    }

    @Test
    public void generateIV_generatesCorrectFormat() throws Exception {
        String iv = BCCrypto.generateIV();
        assertTrue(iv.matches("^[a-f0-9]+$"));
    }

    @Test
    public void generateRandomString_generatesCorrectLength() throws Exception {
        String str1 = BCCrypto.generateRandomString(12);
        String str2 = BCCrypto.generateRandomString(21);
        assertEquals(12, str1.length());
        assertEquals(21, str2.length());
    }

    @Test
    public void generateRandomString_generatesDifferentStrings() throws Exception {
        String str1 = BCCrypto.generateRandomString(5);
        String str2 = BCCrypto.generateRandomString(5);
        assertNotEquals(str1, str2);
    }

    @Test
    public void generateSalt_generatesCorrectLength() throws Exception {
        String salt = BCCrypto.generateSalt(18);
        assertEquals(18, salt.length());
    }

    @Test
    public void generateSalt_generatesCorrectFormat() throws Exception {
        String salt = BCCrypto.generateSalt(16);
        assertTrue(salt.matches("^[a-f0-9]+$"));
    }

    @Test
    public void generateUUID_generatesAValidUUID() throws Exception {
        String uuid = BCCrypto.generateUUID();
        assertTrue(uuid.matches(UUID_REXP));
    }

    @Test
    public void generateUUID_generatesDifferentUUIDs() throws Exception {
        String uuid1 = BCCrypto.generateUUID();
        String uuid2 = BCCrypto.generateUUID();
        assertNotEquals(uuid1, uuid2);
    }

    @Test
    public void generateUUIDs_generatesCorrectAmount() throws Exception {
        String[] uuids = BCCrypto.generateUUIDs(34);
        assertEquals(34, uuids.length);
    }

    @Test
    public void generateUUIDs_generatesCorrectFormat() throws Exception {
        String[] uuids = BCCrypto.generateUUIDs(12);
        for (String uuid: uuids) {
            assertTrue(uuid.matches(UUID_REXP));
        }
    }

}