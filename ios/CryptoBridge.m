#import "CryptoBridge.h"
#import "BCDerivation.h"
#import "BCCrypto.h"

@implementation CryptoBridge

RCT_EXPORT_MODULE(CryptoBridge)

RCT_REMAP_METHOD(deriveKeyFromPassword,
                 deriveKeyFromPassword:(NSString *)password
                 andSalt:(NSString *)salt
                 forRounds:(int)rounds
                 withBits:(int)bits
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *result = [BCDerivation deriveKeyFromPassword:password andSalt:salt forRounds:rounds withBits:bits];
    resolve(result);
}

RCT_REMAP_METHOD(generateSaltWithLength,
                 generateSaltWithLength:(int)length
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *result = [BCCrypto generateSaltWithLength:length];
    resolve(result);
}

RCT_REMAP_METHOD(generateIV,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *result = [BCCrypto generateIVHex];
    resolve(result);
}

RCT_REMAP_METHOD(encryptText,
                 encryptText:(NSString *)text
                 withKey:(NSString *)key
                 andSalt:(NSString *)salt
                 andIV:(NSString *)ivHex
                 andHMAC:(NSString *)hmacHexKey
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *result = [BCCrypto encryptText:text withKey:key andSalt:salt andIV:ivHex andHMAC:hmacHexKey];
    resolve(result);
}

RCT_REMAP_METHOD(decryptText,
                 decryptText:(NSString *)encryptedText
                 withKey:(NSString *)key
                 andIV:(NSString *)ivHex
                 andSalt:(NSString *)saltHex
                 andHMACKey:(NSString *)hmacHexKey
                 andHMAC:(NSString *)hmacHex
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *result = [BCCrypto decryptText:encryptedText withKey:key andIV:ivHex andSalt:saltHex andHMACKey:hmacHexKey andHMAC:hmacHex];
    if ([result rangeOfString:@"Error="].location == 0) {
        NSString *errorString = [result substringFromIndex:6];
        NSError *error = [NSError errorWithDomain:@"pw.buttercup.mobile" code:1 userInfo:@{
          @"error": errorString
        }];
        reject(@"error", [[NSString alloc] initWithFormat:@"Decryption failed: %@", errorString], error);
        return;
    }
    resolve(result);
}

@end
