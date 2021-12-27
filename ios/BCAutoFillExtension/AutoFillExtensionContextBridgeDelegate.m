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

#import "AutoFillExtensionContextBridgeDelegate.h"

@interface AutoFillExtensionContextBridgeDelegate ()
@property (nonatomic, strong) NSArray *extraModules;
@end

@implementation AutoFillExtensionContextBridgeDelegate
+ (NSString *)moduleNameForBridge
{
    return @"Buttercup";
}

- (instancetype)initWithExtensionContext:(ASCredentialProviderExtensionContext *)extensionContext
{
    self = [super init];
    if (self)
    {
        AutoFillBridge *autoFillBridgeModule = [[AutoFillBridge alloc] initWithExtensionContext:extensionContext];
        self.extraModules = @[autoFillBridgeModule];
    }

    return self;
}

- (void) updateExtensionContext:(ASCredentialProviderExtensionContext *)extensionContext
{
    [(AutoFillBridge *)self.extraModules[0] setExtensionContext:extensionContext];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
    // Works on device, hard-coded:
    // return [NSURL URLWithString:@"http://192.168.1.144:8081/index.bundle?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true&app=pw.buttercup.mobile"];
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
{
    return _extraModules;
}
@end
