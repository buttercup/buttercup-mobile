//
//  CryptoBridge.m
//  Buttercup
//
//  Created by Perry Mitchell on 24/5/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "CryptoBridge.h"
#import "BCDerivation.h"
#import "BCCrypto.h"

@implementation CryptoBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(deriveKeyFromPassword:(NSString *)password andSalt:(NSString *)salt forRounds:(int)rounds thenCallBack:(RCTResponseSenderBlock)callback) {
    callback(@[[NSNull null], [BCDerivation deriveKeyFromPassword:password andSalt:salt forRounds:rounds]]);
}

RCT_EXPORT_METHOD(encryptText:(NSString *)text withKey:(NSString *)key andSalt:(NSString *)salt andHMAC:(NSString *)hmacHexKey thenCallBack:(RCTResponseSenderBlock)callback) {
    callback(@[
        [NSNull null],
        [BCCrypto encryptText:text withKey:key andSalt:salt andHMAC:hmacHexKey]
    ]);
}

RCT_EXPORT_METHOD(decryptText:(NSString *)encryptedText withKey:(NSString *)key andIV:(NSString *)ivHex andSalt:(NSString *)saltHex andHMACKey:(NSString *)hmacHexKey andHMAC:(NSString *)hmacHex thenCallBack:(RCTResponseSenderBlock)callback) {
    callback(@[
        [NSNull null],
        [BCCrypto decryptText:encryptedText withKey:key andIV:ivHex andSalt:saltHex andHMACKey:hmacHexKey andHMAC:hmacHex]
    ]);
}

@end
