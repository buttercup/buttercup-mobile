//
//  AutoFillBridge.m
//  Buttercup
//
//  Created by Jacob Morris on 5/1/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AutoFillBridge.h"
#import "AutoFillHelpers.h"

@implementation AutoFillBridge

// The React Native bridge needs to know our module
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (instancetype)initWithExtensionContext:(ASCredentialProviderExtensionContext *)extensionContext
API_AVAILABLE(ios(12.0)){
    self = [super init];
    if (self)
    {
        self.extensionContext = extensionContext;
    }
    
    return self;
}

- (NSDictionary *)constantsToExport
{
    return @{ @"DEVICE_SUPPORTS_AUTOFILL": @([AutoFillHelpers deviceSupportsAutoFill]) };
}

/**
 * Merge Buttercup Credential Entries from a single Archive to the intermediate entry store (iOS Keychain),
 *   then update the ASCredentialIdentityStore with the final list of Entries so they are available in the QuickBar
 *
 * The BCAutoFillExtension will use the intermediate store to reverse map the iOS supplied Identity ASCredentialIdentityStore
 *   to a Buttercup Credential (and password) to complete the AutoFill process
 */
RCT_EXPORT_METHOD(updateEntriesForSourceID:(NSString *)sourceID entries:(NSDictionary *)entries resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // First retrieve the current intermediate store state so we can merge into it
    NSMutableDictionary *autoFillEntries = [[AutoFillHelpers getAutoFillEntries] mutableCopy];
    
    // Merge in the updated credentials
    autoFillEntries[sourceID] = entries;
    
    // Sync the entries to the Keychain
    NSError *saveError = [AutoFillHelpers setAutoFillEntries:autoFillEntries];
    
    // Handle any errors saving to Keychain
    if (saveError != nil) {
        return reject([NSString stringWithFormat:@"%li", (long)saveError.code], [saveError localizedDescription], nil);
    }
    
    // Now that the store has been synced, update the ASCredentialIdentityStore with all the identies
    [AutoFillHelpers updateASCredentialIdentityStore:autoFillEntries];
    
    return resolve(@YES);
}

/**
 * Remove all Entries for a Source from the credential store and update the ASCredentialIdentityStore to reflect the changes
 */
RCT_EXPORT_METHOD(removeEntriesForSourceID:(NSString *)sourceID resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSMutableDictionary *autoFillEntries = [[AutoFillHelpers getAutoFillEntries] mutableCopy];
    
    // Delete the Source and it's Entries. removeObjectForKey continues if the source does or does not exist.
    [autoFillEntries removeObjectForKey:sourceID];
    
    // Sync the entries to the Keychain
    NSError *saveError = [AutoFillHelpers setAutoFillEntries:autoFillEntries];
    
    // Handle any errors saving to Keychain
    if (saveError != nil) {
        return reject([NSString stringWithFormat:@"%li", (long)saveError.code], [saveError localizedDescription], nil);
    }
    
    // Now that the store has been synced, update the ASCredentialIdentityStore with all the identies
    [AutoFillHelpers updateASCredentialIdentityStore:autoFillEntries];
    
    return resolve(@YES);
}

/**
 * Complete the Manual AutoFill Process by sending a desired username and password back to the iOS AutoFill Extension Context.
 * Note: This method should ONLY be used when the module is loaded inside an iOS AutoFill Overlay.
 * Use the AutoFillBridgeDelegate
 */
RCT_EXPORT_METHOD(completeAutoFill:(NSString *)username password:(NSString *)password resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if (![AutoFillHelpers deviceSupportsAutoFill]) {
        reject(@"", @"Device does not support AutoFill.", nil);
    } else if (self.extensionContext == nil) {
        reject(@"", @"AutoFill Extension Context not available. This method should only be run from the Buttercup AutoFill Overlay.", nil);
    } else {
        ASPasswordCredential *credential = [[ASPasswordCredential alloc] initWithUser:username password:password];
        [self.extensionContext completeRequestWithSelectedCredential:credential completionHandler:nil];
        resolve(@YES);
    }
}

RCT_EXPORT_METHOD(cancelAutoFill:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if (![AutoFillHelpers deviceSupportsAutoFill]) {
        reject(@"", @"Device does not support AutoFill.", nil);
    } else if (self.extensionContext == nil) {
        reject(@"", @"AutoFill Extension Context not available. This method should only be run from the Buttercup AutoFill Overlay.", nil);
    } else {
        [self.extensionContext cancelRequestWithError:[NSError errorWithDomain:ASExtensionErrorDomain code:ASExtensionErrorCodeUserCanceled userInfo:nil]];
        resolve(@YES);
    }
}

@end
