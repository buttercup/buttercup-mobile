package com.buttercup;

import java.util.Arrays;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by perry on 11/10/17.
 */
public class BCHelpersTest {

    private byte[] sampleByteArray;

    @Before
    public void setUp() throws Exception {
        byte[] testArray = { (byte) 0xaf, (byte) 0x2c, (byte) 0xff };
        sampleByteArray = testArray;
    }

    @Test
    public void byteArrayToHexString_producesCorrectHex() throws Exception {
        String hexString = BCHelpers.byteArrayToHexString(sampleByteArray);
        assertEquals("af2cff", hexString);
    }

    @Test
    public void hexStringToByteArray() throws Exception {
        byte[] bytes = BCHelpers.hexStringToByteArray("af2cff");
        assertTrue(Arrays.equals(bytes, sampleByteArray));
    }

}