package pw.buttercup.mobile;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

class BCCryptoTest {

//    @Test
//    void decryptText() {
//    }

    @Test
    void encryptText_encryptsText() throws Exception {
        String derivedKey = BCDerivation.deriveKeyFromPassword("test", "abc123", 10000, 512);
        String keyHex = derivedKey.substring(0, 64);
        String hmacKeyHex = derivedKey.substring(64);
        String saltHex = BCCrypto.generateSalt(16);
        String ivHex = BCCrypto.generateIV();
        // Encrypt
        String source = BCHelpers.stringToBase64("This is some text!");
        String encrypted = BCCrypto.encryptText(source, keyHex, saltHex, ivHex, hmacKeyHex);
        // Test
        String[] parts = encrypted.split("\\|");
        assertEquals(4, parts.length);
    }

    @Test
    void generateIV_generatesCorrectByteLength() throws Exception {
        String iv = BCCrypto.generateIV();
        assertEquals(BCCrypto.IV_BYTE_LEN * 2, iv.length());
    }

    @Test
    void generateRandomString_generatesCorrectLength() {
        String str = BCCrypto.generateRandomString(48);
        assertEquals(48, str.length());
    }

    @Test
    void generateSalt_generatesCorrectLength() {
        String salt = BCCrypto.generateSalt(16);
        assertEquals(16, salt.length());
    }

}
