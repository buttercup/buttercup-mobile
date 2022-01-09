package com.buttercup;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

class BCHelpersTest {

    @Test
    void base64ToString_decodesBase64() {
        String source = "VGhpcyBpcyBzb21lIHRleHQ=";
        assertEquals("This is some text", BCHelpers.base64ToString(source));
    }

    @Test
    void byteArrayToHexString_convertsBytesToHex() {
        byte[] bytes = { 0xa, 0x2, (byte) 0xff, 0x11 };
        assertEquals("0a02ff11", BCHelpers.byteArrayToHexString((bytes)));
    }

    @Test
    void hexStringToByteArray_convertsHexToBytes() {
        String hex = "0a02ff11";
        byte[] bytes = { 0xa, 0x2, (byte) 0xff, 0x11 };
        assertArrayEquals(bytes, BCHelpers.hexStringToByteArray((hex)));
    }

    @Test
    void stringToBase64_convertsStringToBase64() {
        String source = "This is some text";
        assertEquals("VGhpcyBpcyBzb21lIHRleHQ=", BCHelpers.stringToBase64(source));
    }

}
