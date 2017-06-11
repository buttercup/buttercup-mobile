//
//  BCDerivation.h
//  TestCrypto
//
//  Created by Perry Mitchell on 23/5/17.
//  Copyright © 2017 Perry Mitchell. All rights reserved.
//

#import <Foundation/Foundation.h>

extern int const IV_BYTE_LEN;

@interface BCDerivation : NSObject

+ (NSString *)deriveKeyFromPassword:(NSString *)password andSalt:(NSString *)salt forRounds:(int)rounds;
+ (NSString *)generateIV;
+ (NSString *)generateSaltWithLength:(int)length;
+ (NSString *)hexStringFromData:(NSData *)data;

@end
