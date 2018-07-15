#import "CryptoBindings.h"
#import "CryptoBridge.h"
#import "Crypto.h"
#import <React/RCTLog.h>
#include <sys/sysctl.h>
#import "BCHelpers.h"

@implementation CryptoBridge

// The React Native bridge needs to know our module
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(decryptText:(NSString *)data:(NSString *)key:(NSString *)ivHex:(NSString *)salt:(NSString *)hmacHexKey:(NSString *)hmacHex:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    NSString *decryptedString = [Crypto decryptText:data usingKey:key andSalt:salt andIV:ivHex andHMACKey:hmacHexKey andHMAC:hmacHex];
    if (decryptedString && [decryptedString length] > 0) {
        resolve(decryptedString);
    } else {
        reject(
               @"decryption_failed",
               @"Decryption failed: Possible tampering",
               [BCHelpers newErrorObject]
               );
    }
}

RCT_EXPORT_METHOD(encryptText:(NSString *)data:(NSString *)key:(NSString *)salt:(NSString *)ivHex:(NSString *)hmacHexKey:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    NSString *encryptedString = [Crypto encryptText:data usingKey:key andSalt:salt andIV:ivHex andHMACKey:hmacHexKey];
    if (encryptedString && [encryptedString length] > 0) {
        resolve(encryptedString);
    } else {
        reject(
               @"encryption_failed",
               @"Encryption failed",
               [BCHelpers newErrorObject]
               );
    }
}

RCT_EXPORT_METHOD(generateIV:(int)length:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    NSString *iv = [Crypto generateIVWithLength:length];
    if (iv && [iv length] > 0) {
        resolve(iv);
    } else {
        reject(
            @"iv_generation_failed",
            @"IV generation failed",
            [BCHelpers newErrorObject]
        );
    }
}

RCT_EXPORT_METHOD(generateSaltWithLength:(int)length:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    NSString *salt = [Crypto generateSaltWithLength:length];
    if (salt && [salt length] > 0) {
        resolve(salt);
    } else {
        reject(
               @"salt_generation_failed",
               @"Salt generation failed",
               [BCHelpers newErrorObject]
               );
    }
}

RCT_EXPORT_METHOD(generateUUIDs:(int)count:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    const char* uuidList = generate_uuid_list(count);
    if (uuidList) {
        resolve([NSString stringWithUTF8String:uuidList]);
        dealloc_memory(uuidList);
    } else {
        reject(
               @"uuid_generation_failed",
               @"Generating UUIDs failed.",
               [BCHelpers newErrorObject]
               );
    }
}

RCT_EXPORT_METHOD(pbkdf2:(NSString *)password:(NSString *)salt:(int)iterations:(int)bits:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    NSString *derivedData = [Crypto pbkdf2UsingPassword:password andSalt:salt andIterations:iterations andBits:bits];
    if (derivedData && [derivedData length] > 0) {
        resolve(derivedData);
    } else {
        reject(
            @"pbkdf2_failed",
            @"Key Derivation failed",
            [BCHelpers newErrorObject]
        );
    }
}

@end
