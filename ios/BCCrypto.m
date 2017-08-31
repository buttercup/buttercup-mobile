//
//  BCCrypto.m
//  Buttercup
//
//  Created by Perry Mitchell on 29/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "BCCrypto.h"
#import "BCHelpers.h"
#import <CommonCrypto/CommonKeyDerivation.h>
#import <CommonCrypto/CommonCryptor.h>
#import <CommonCrypto/CommonHMAC.h>

@implementation BCCrypto

int const IV_BYTE_LEN = 16;

+ (NSString *)decryptText:(NSString *)encryptedText withKey:(NSString *)key andIV:(NSString *)ivHex andSalt:(NSString *)saltHex andHMACKey:(NSString *)hmacHexKey andHMAC:(NSString *)hmacHex {
    // Data prep
    NSData *dataIn = [[NSData alloc] initWithBase64EncodedString:encryptedText options:0];
    NSData *keyData = [BCHelpers dataFromHexString:key];
    NSData *ivData = [BCHelpers dataFromHexString:ivHex];
    // HMAC verification
    NSString *hmacTarget = [NSString stringWithFormat:@"%@%@%@", encryptedText, ivHex, saltHex];
    const char *cKey = [BCHelpers characterArrayFromHexString:hmacHexKey];
    const char *cData = [hmacTarget cStringUsingEncoding:NSASCIIStringEncoding];
    unsigned char cHMAC[CC_SHA256_DIGEST_LENGTH];
    CCHmac(kCCHmacAlgSHA256, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
    NSData *hmacData = [[NSData alloc] initWithBytes:cHMAC length:sizeof(cHMAC)];
    NSString *reproducedHmac = [BCHelpers hexStringFromData:hmacData];
    if (![BCHelpers constantTimeCompare:reproducedHmac toChallenger:hmacHex]) {
//        return [NSString stringWithFormat:@"%@\n%@\n%@\n%@\n%@\n\n\n%@ === %@", key, ivHex, saltHex, hmacHexKey, hmacHex, reproducedHmac, hmacHex];
        return @"Error:Authentication failed - possible tampering";
    }
    // Crypto prep
    CCCryptorStatus ccStatus = kCCSuccess;
    size_t cryptBytes = 0;
    NSMutableData *dataOut = [NSMutableData dataWithLength:dataIn.length + kCCBlockSizeAES128];
    // Crypto
    ccStatus = CCCrypt(kCCDecrypt,
                       kCCAlgorithmAES128,
                       kCCOptionPKCS7Padding,
                       keyData.bytes, keyData.length,
                       ivData.bytes,
                       dataIn.bytes, dataIn.length,
                       dataOut.mutableBytes, dataOut.length,
                       &cryptBytes
    );
    if (ccStatus == kCCSuccess) {
        dataOut.length = cryptBytes;
    } else {
        return [NSString stringWithFormat:@"Error=%i", ccStatus];
    }
    NSString *decryptedText = [[NSString alloc] initWithData:dataOut encoding:NSUTF8StringEncoding];
    return decryptedText;
}

+ (NSString *)encryptText:(NSString *)text withKey:(NSString *)key andSalt:(NSString *)salt andHMAC:(NSString *)hmacHexKey {
    // Validation
    if (key.length != 64) {
        return @"Error:Invalid key length";
    } else if (hmacHexKey.length != 64) {
        return @"Error:Invalid authentication information or possible tampering";
    }
    // Data prep
    NSString *iv = [BCCrypto generateIV];
    NSData *ivData = [iv dataUsingEncoding:NSUTF8StringEncoding];
    NSData *dataIn = [text dataUsingEncoding:NSUTF8StringEncoding];
    NSData *keyData = [BCHelpers dataFromHexString:key];
    NSData *saltData = [salt dataUsingEncoding:NSUTF8StringEncoding];
    // Crypto prep
    CCCryptorStatus ccStatus = kCCSuccess;
    size_t cryptBytes = 0;
    NSMutableData *dataOut = [NSMutableData dataWithLength:dataIn.length + kCCBlockSizeAES128];
    // Crypto
    ccStatus = CCCrypt(
                       kCCEncrypt,
                       kCCAlgorithmAES128,
                       kCCOptionPKCS7Padding,
                       keyData.bytes, keyData.length,
                       ivData.bytes,
                       dataIn.bytes, dataIn.length,
                       dataOut.mutableBytes, dataOut.length,
                       &cryptBytes
    );
    if (ccStatus == kCCSuccess) {
        dataOut.length = cryptBytes;
    } else {
        return [NSString stringWithFormat:@"Error=%i", ccStatus];
    }
    NSString *encryptedContent = [dataOut base64EncodedStringWithOptions:0];
    // HMAC
    NSString *saltHex = [BCHelpers hexStringFromData:saltData];
    NSString *ivHex = [BCHelpers hexStringFromData:ivData];
    NSString *hmacTarget = [NSString stringWithFormat:@"%@%@%@", encryptedContent, ivHex, saltHex];
    const char *cKey = [BCHelpers characterArrayFromHexString:hmacHexKey];
    const char *cData = [hmacTarget cStringUsingEncoding:NSASCIIStringEncoding];
    unsigned char cHMAC[CC_SHA256_DIGEST_LENGTH];
    CCHmac(kCCHmacAlgSHA256, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
    NSData *hmacData = [[NSData alloc] initWithBytes:cHMAC length:sizeof(cHMAC)];
    NSString *hmacHex = [BCHelpers hexStringFromData:hmacData];
    // Join
    return [NSString stringWithFormat:@"%@|%@|%@|%@", encryptedContent, hmacHex, ivHex, saltHex];
}

+ (NSString *)generateIV {
    return [BCCrypto generateSaltWithLength:IV_BYTE_LEN];
}

+ (NSString *)generateSaltWithLength:(int)length {
    unsigned char salt[length];
    for (int i = 0; i < length; i += 1) {
        salt[i] = (unsigned char)arc4random();
    }
    return [BCHelpers hexStringFromData:[NSData dataWithBytes:salt length:length]];
}

@end
