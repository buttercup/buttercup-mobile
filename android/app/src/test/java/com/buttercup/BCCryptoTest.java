package com.buttercup;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by perry on 10/10/17.
 */
public class BCCryptoTest {

    private static final String BASE64_REXP = "^[A-Za-z0-9+/=]+$";
    private static final String HEX_REXP = "^[a-f0-9]+$";
    private static final String UUID_REXP = "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$";

    private static final String exportUnencryptedText = " 1x^^\\ \t\n +Hey@..!ä";

    private String keyHex;
    private String saltHex;
    private String hmacKeyHex;

    @Before
    public void setUp() throws Exception {
        keyHex = BCCrypto.generateSalt(64); // random hex string
        saltHex = BCCrypto.generateSalt(16);
        hmacKeyHex = BCCrypto.generateSalt(64);
    }

    @Test
    public void decryptText_decryptsContentFromEncryptText() {
        String encryptedBlock = BCCrypto.encryptText(exportUnencryptedText, keyHex, saltHex, hmacKeyHex);
        String[] parts = encryptedBlock.split("\\|");
        String encryptedContent = parts[0];
        String hmacHex = parts[1];
        String ivHex = parts[2];
        String decryptedText = BCCrypto.decryptText(encryptedContent, keyHex, ivHex, saltHex, hmacKeyHex, hmacHex);
        assertEquals(exportUnencryptedText, decryptedText);
    }

    @Test
    public void encryptText_returnsCorrectlyFormattedContent() {
        String encryptedBlock = BCCrypto.encryptText(exportUnencryptedText, keyHex, saltHex, hmacKeyHex);
        String encryptedContent = encryptedBlock.split("\\|")[0];
        assertTrue(encryptedContent.matches(BASE64_REXP));
//        System.out.println(encryptedBlock);
//        System.out.println(keyHex + " " + saltHex + " " + hmacKeyHex);
    }

    @Test
    public void encryptText_returnsCorrectlyFormattedHMAC() {
        String encryptedBlock = BCCrypto.encryptText(exportUnencryptedText, keyHex, saltHex, hmacKeyHex);
        String hmac = encryptedBlock.split("\\|")[1];
        assertTrue(hmac.matches(HEX_REXP));
    }

    @Test
    public void encryptText_returnsCorrectlyFormattedIV() {
        String encryptedBlock = BCCrypto.encryptText(exportUnencryptedText, keyHex, saltHex, hmacKeyHex);
        String iv = encryptedBlock.split("\\|")[2];
        assertTrue(iv.matches(HEX_REXP));
    }

    @Test
    public void encryptText_returnsCorrectStructure() {
        String encryptedBlock = BCCrypto.encryptText(exportUnencryptedText, keyHex, saltHex, hmacKeyHex);
        String[] components = encryptedBlock.split("\\|");
        assertEquals(4, components.length);
    }

    @Test
    public void encryptText_returnsSameSalt() {
        String encryptedBlock = BCCrypto.encryptText(exportUnencryptedText, keyHex, saltHex, hmacKeyHex);
        String salt = encryptedBlock.split("\\|")[3];
        assertEquals(saltHex, salt);
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