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

@end
