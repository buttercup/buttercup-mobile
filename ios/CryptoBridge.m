//
//  CryptoBridge.m
//  Buttercup
//
//  Created by Perry Mitchell on 24/5/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "CryptoBridge.h"
#import "BCDerivation.h"

@implementation CryptoBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(deriveKeyFromPassword:(NSString *)password andSalt:(NSString *)salt forRounds:(int)rounds thenCallBack:(RCTResponseSenderBlock)callback) {
    callback(@[[NSNull null], [BCDerivation deriveKeyFromPassword:password andSalt:salt forRounds:rounds]]);
}

@end
