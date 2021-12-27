#import "BCCrypto.h"
#import "BCHelpers.h"
#import <CommonCrypto/CommonKeyDerivation.h>
#import <CommonCrypto/CommonCryptor.h>
#import <CommonCrypto/CommonHMAC.h>

@implementation BCCrypto

int const IV_BYTE_LEN = 16;

+ (NSString *)decryptText:(NSString *)encryptedText withKey:(NSString *)key andIV:(NSString *)ivHex andSalt:(NSString *)salt andHMACKey:(NSString *)hmacHexKey andHMAC:(NSString *)hmacHex {
    // Data prep
    NSData *dataIn = [[NSData alloc] initWithBase64EncodedString:encryptedText options:0];
    NSData *keyData = [BCHelpers dataFromHexString:key];
    NSData *ivData = [BCHelpers dataFromHexString:ivHex];
    // HMAC verification
    NSString *hmacTarget = [NSString stringWithFormat:@"%@%@%@", encryptedText, ivHex, salt];
    const char *cKey = [BCHelpers characterArrayFromHexString:hmacHexKey];
    unsigned long ckeyLen = hmacHexKey.length / 2;
    const char *cData = [hmacTarget cStringUsingEncoding:NSASCIIStringEncoding];
    unsigned char cHMAC[CC_SHA256_DIGEST_LENGTH];
    CCHmac(kCCHmacAlgSHA256, cKey, ckeyLen, cData, strlen(cData), cHMAC);
    NSData *hmacData = [[NSData alloc] initWithBytes:cHMAC length:sizeof(cHMAC)];
    NSString *reproducedHmac = [BCHelpers hexStringFromData:hmacData];
    if (![BCHelpers constantTimeCompare:reproducedHmac toChallenger:hmacHex]) {
        return @"Error=Authentication failed - incorrect password?";
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
    return [BCHelpers base64FromData:dataOut];
}

+ (NSString *)encryptText:(NSString *)text withKey:(NSString *)key andSalt:(NSString *)salt andIV:(NSString *)iv andHMAC:(NSString *)hmacHexKey {
    // Validation
    if (key.length != 64) {
        return @"Error=Invalid key length";
    } else if (hmacHexKey.length != 64) {
        return @"Error=Invalid authentication information";
    }
    // Data prep
    NSData *ivData = [BCHelpers dataFromHexString:iv];
    NSData *dataIn = [BCHelpers dataFromBase64:text];
    NSData *keyData = [BCHelpers dataFromHexString:key];
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
    NSString *ivHex = [BCHelpers hexStringFromData:ivData];
    NSString *hmacTarget = [NSString stringWithFormat:@"%@%@%@", encryptedContent, ivHex, salt];
    const char *cKey = [BCHelpers characterArrayFromHexString:hmacHexKey];
    unsigned long ckeyLen = hmacHexKey.length / 2;
    const char *cData = [hmacTarget cStringUsingEncoding:NSASCIIStringEncoding];
    unsigned char cHMAC[CC_SHA256_DIGEST_LENGTH];
    CCHmac(kCCHmacAlgSHA256, cKey, ckeyLen, cData, strlen(cData), cHMAC);
    NSData *hmacData = [[NSData alloc] initWithBytes:cHMAC length:sizeof(cHMAC)];
    NSString *hmacHex = [BCHelpers hexStringFromData:hmacData];
    // Join
    return [NSString stringWithFormat:@"%@|%@|%@|%@", encryptedContent, hmacHex, ivHex, salt];
}

+ (NSString *)generateIVHex {
    unsigned char salt[IV_BYTE_LEN];
    for (int i = 0; i < IV_BYTE_LEN; i += 1) {
        salt[i] = (unsigned char)arc4random();
    }
    return [BCHelpers hexStringFromData:[NSData dataWithBytes:salt length:IV_BYTE_LEN]];
}

+ (NSString *)generateRandomStringWithLength:(int)length {
    NSString *alphabet  = @"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY0123456789!@#$%^&*(){}[]<>,.?~|-=_+";
    NSMutableString *s = [NSMutableString stringWithCapacity:length];
    for (NSUInteger i = 0U; i < length; i++) {
        u_int32_t r = arc4random() % [alphabet length];
        unichar c = [alphabet characterAtIndex:r];
        [s appendFormat:@"%C", c];
    }
    return s;
}

+ (NSString *)generateSaltWithLength:(int)length {
    NSString *randomString = [BCCrypto generateRandomStringWithLength:length * 2];
    NSData *randomData = [randomString dataUsingEncoding:NSUTF8StringEncoding];
    return [[BCHelpers hexStringFromData:randomData] substringToIndex:length];
}

+ (NSString *)generateUUID {
    NSUUID *uuid = [[NSUUID alloc] init];
    return [uuid.UUIDString lowercaseString];
}

+ (NSArray *)generateUUIDsForCount:(int)count {
    NSMutableArray *uuids = [[NSMutableArray alloc] init];
    for (int i = 0; i < count; i += 1) {
        NSString *uuid = [BCCrypto generateUUID];
        [uuids addObject:uuid];
    }
    return [NSArray arrayWithArray:uuids];
}

@end
