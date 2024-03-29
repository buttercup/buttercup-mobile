//
//  BCHelpers.h
//  Buttercup
//
//  Created by Perry Mitchell on 29/8/17.
//

/**
 * Copyright (c) 2017-present, Buttercup, Inc.
 *
 * This source code is licensed under the GNU GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

@interface BCHelpers : NSObject

+ (NSString*)base64FromData:(NSData*)data;
+ (char *)characterArrayFromHexString:(NSString *)hexString;
+ (BOOL)constantTimeCompare:(NSString *)reference toChallenger:(NSString *)challenger;
+ (NSData *)dataFromBase64:(NSString *)b64;
+ (NSData *)dataFromHexString:(NSString *)string;
+ (NSString *)hexStringFromData:(NSData *)data;

@end
