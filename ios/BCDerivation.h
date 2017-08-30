//
//  BCDerivation.h
//  TestCrypto
//
//  Created by Perry Mitchell on 23/5/17.
//  Copyright © 2017 Perry Mitchell. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface BCDerivation : NSObject

+ (NSString *)deriveKeyFromPassword:(NSString *)password andSalt:(NSString *)salt forRounds:(int)rounds;

@end
