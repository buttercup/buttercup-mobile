//
//  BCHelpers.h
//  Buttercup
//
//  Created by Perry Mitchell on 29/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface BCHelpers : NSObject

+ (char *)characterArrayFromHexString:(NSString *)hexString;
+ (BOOL)constantTimeCompare:(NSString *)reference toChallenger:(NSString *)challenger;
+ (NSData *)dataFromHexString:(NSString *)string;
+ (NSString *)hexStringFromData:(NSData *)data;
+ (NSError *)convertExceptionToError:(NSException *)exception;

@end
