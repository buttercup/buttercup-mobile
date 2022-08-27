package com.buttercup.securestorage;

import android.content.Context;
import android.hardware.fingerprint.FingerprintManager;
import android.os.Build;

/**
 * Taken from https://github.com/oyyq99999/react-native-secure-storage
 */

class DeviceAvailability {

    public static boolean isFingerprintAuthAvailable(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            FingerprintManager fingerprintManager =
                    (FingerprintManager) context.getSystemService(Context.FINGERPRINT_SERVICE);
            return fingerprintManager.isHardwareDetected() &&
                    fingerprintManager.hasEnrolledFingerprints();
        }
        return false;
    }
}
