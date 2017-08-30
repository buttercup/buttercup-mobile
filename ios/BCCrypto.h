//
//  BCCrypto.h
//  Buttercup
//
//  Created by Perry Mitchell on 29/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

extern int const IV_BYTE_LEN;

@interface BCCrypto : NSObject

//+ (NSString *)decryptText:(NSString *)encryptedText withIV:(NSString *)ivHex andSalt:(NSString *)salt andHMAC:(NSString *)hmacHex;
+ (NSString *)encryptText:(NSString *)text withKey:(NSString *)key andSalt:(NSString *)salt andHMAC:(NSString *)hmac andRounds:(int)pbkdf2Rounds;
+ (NSString *)generateIV;
+ (NSString *)generateSaltWithLength:(int)length;

@end
