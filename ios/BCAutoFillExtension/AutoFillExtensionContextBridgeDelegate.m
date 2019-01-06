//
//  AutoFillBridgeDelegate.m
//  BCAutoFillExtension
//
//  Created by Jacob Morris on 6/1/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AutoFillExtensionContextBridgeDelegate.h"

@interface AutoFillExtensionContextBridgeDelegate ()
@property (nonatomic, strong) NSArray *extraModules;
@end

@implementation AutoFillExtensionContextBridgeDelegate
+ (NSString *)moduleNameForBridge
{
    return @"ButtercupAutoFill";
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

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios.autofill" fallbackResource:nil];
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
{
    return _extraModules;
}
@end
