package com.buttercup;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

class BCDerivationTest {

    @Test
    void deriveKeyFromPassword_derivesCorrectLength() {
        String key = BCDerivation.deriveKeyFromPassword("test-pass", "abc123", 10000, 512);
        assertEquals(128, key.length());
    }

    @Test
    void deriveKeyFromPassword_derivesSameKeyFromSamePassword() {
        String key1 = BCDerivation.deriveKeyFromPassword("test-pass", "abc123", 10000, 512);
        String key2 = BCDerivation.deriveKeyFromPassword("test-pass", "abc123", 10000, 512);
        assertEquals(key1, key2);
    }

    @Test
    void deriveKeyFromPassword_derivesDifferentKeysForSalts() {
        String key1 = BCDerivation.deriveKeyFromPassword("test-pass", "abc123", 10000, 512);
        String key2 = BCDerivation.deriveKeyFromPassword("test-pass", "def456", 10000, 512);
        assertNotEquals(key1, key2);
    }

    @Test
    void deriveKeyFromPassword_derivesDifferentKeysForPasswords() {
        String key1 = BCDerivation.deriveKeyFromPassword("test-pass", "abc123", 10000, 512);
        String key2 = BCDerivation.deriveKeyFromPassword("pass-test", "abc123", 10000, 512);
        assertNotEquals(key1, key2);
    }

}
