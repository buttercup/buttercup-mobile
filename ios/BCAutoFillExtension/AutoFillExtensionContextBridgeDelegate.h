//
//  AutoFillBridgeDelegate.h
//  Buttercup
//
//  Created by Jacob Morris on 6/1/19.
//

/**
 * Copyright (c) 2017-present, Buttercup, Inc.
 *
 * This source code is licensed under the GNU GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

#if __has_include(<React/RCTBridgeDelegate.h>)
#import <React/RCTBridgeDelegate.h>
#elif __has_include("RCTBridgeDelegate.h")
#import "RCTBridgeDelegate.h"
#else
#import "React/RCTBridgeDelegate.h"
#endif

#import <React/RCTBundleURLProvider.h>
#import <AuthenticationServices/AuthenticationServices.h>
#import "AutoFillBridge.h"

@interface AutoFillExtensionContextBridgeDelegate : NSObject <RCTBridgeDelegate>
+ (NSString *)moduleNameForBridge;
- (instancetype)initWithExtensionContext:(ASCredentialProviderExtensionContext *)extensionContext;
- (void) updateExtensionContext:(ASCredentialProviderExtensionContext *)extensionContext;
@end
