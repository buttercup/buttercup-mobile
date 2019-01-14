//
//  CredentialProviderViewController.m
//  ButtercupAutoFill
//
//  Created by Jacob Morris on 30/12/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "CredentialProviderViewController.h"
#import "AutoFillExtensionContextBridgeDelegate.h"
#import <React/RCTRootView.h>

// id<RCTBridgeDelegate> autoFillBridgeDelegate;
AutoFillExtensionContextBridgeDelegate *autoFillBridgeDelegate;
RCTBridge *bridge;
RCTRootView *rootView;
@implementation CredentialProviderViewController

- (void) viewWillDisappear:(BOOL)animated
{
    // Release the RN Bridge to free up memory
    if (bridge != nil) {
        [bridge invalidate];
    }
}

/**
 * Load the custom React Native Entry Point as the UI for manual selection of a Credential
 * Note: We use the custom AutoFillExtensionContextBridgeDelegate so that the AutoFill Extension Context
 *  can be injected into the Bridge (via the AutoFillBrige). This will enable the AutoFill Cancel and
 *   Completion callbacks to be exectued via the React Native JS Bridge.
 *
 * We also pass additional initialProperties to the React Native app, so we can give it some context
 *  about the Service or Failed Credential that the user is trying to log into or with.
 */
- (void)loadReactNativeUI:(NSDictionary *) appProps
{
    // Add a flag to the appProps to indicate we are loading from AutoFill
    NSMutableDictionary *appPropsFinal = [appProps mutableCopy];
    [appPropsFinal setValue:@true forKey:@"isContextAutoFill"];

    if (autoFillBridgeDelegate == nil || bridge == nil || rootView == nil) {
        // Either this is a brand new Extension Instance, or something got garbage collected.
        // Setup a new RN Bridge and App to display
        autoFillBridgeDelegate = [[AutoFillExtensionContextBridgeDelegate alloc]
                                  initWithExtensionContext:self.extensionContext];
        
        bridge = [[RCTBridge alloc] initWithDelegate:autoFillBridgeDelegate launchOptions:nil];
        
        rootView = [[RCTRootView alloc] initWithBridge:bridge
                                            moduleName:[AutoFillExtensionContextBridgeDelegate moduleNameForBridge]
                                     initialProperties:appPropsFinal];
        
    } else {
        // We already have a running Bridge instance
        // Supply the new Extension Context to the Bridge so that AutoFill completion/cancel works,
        // and new Props to the App (e.g. if the user is trying to autofill on a different website).
        [autoFillBridgeDelegate updateExtensionContext:self.extensionContext];
        [rootView setAppProperties:appPropsFinal];
        [bridge reload]; // The bridge will have been invalidated in viewWillDisappear. Make sure it's running again.
    }
    
    self.view = rootView;
}

/*
 Prepare your UI to list available credentials for the user to choose from. The items in
 'serviceIdentifiers' describe the service the user is logging in to, so your extension can
 prioritize the most relevant credentials in the list.
 */
- (void)prepareCredentialListForServiceIdentifiers:(NSArray<ASCredentialServiceIdentifier *> *)serviceIdentifiers
{
    NSLog(@"BCUP_AF prepareCredentialListForServiceIdentifiers");
    
    // Pass the serviceIdentifiers to the React Native app via the initialProperties initializer
    NSMutableArray *identifiers = [[NSMutableArray alloc] init];
    
    for (id serviceIdentifier in serviceIdentifiers) {
        [identifiers addObject:[serviceIdentifier identifier]];
    }
    
    NSDictionary *initialProps = [NSDictionary dictionaryWithObject: identifiers forKey: @"serviceIdentifiers"];
    [self loadReactNativeUI: initialProps];
}

/*
 * Attempt to match an identity tapped in the QuickBar to a Buttercup Entry
 */
 - (void)provideCredentialWithoutUserInteractionForIdentity:(ASPasswordCredentialIdentity *)credentialIdentity
 {
     NSLog(@"BCUP_AF provideCredentialWithoutUserInteractionForIdentity");
     ASPasswordCredential *matchingCredential = [AutoFillHelpers getAutoFillPasswordCredential:credentialIdentity];
     if (matchingCredential != nil) {
         [self.extensionContext completeRequestWithSelectedCredential:matchingCredential completionHandler:nil];
     } else {
         // Failed to find matching Buttercup entry.. send the user to the UI to choose a credential manually
         [self.extensionContext cancelRequestWithError:[NSError errorWithDomain:ASExtensionErrorDomain code:ASExtensionErrorCodeUserInteractionRequired userInfo:nil]];
     }
 }
 

/*
 * User tapped user from the QuickBar but we were unable to match to a Buttercup credential.
 * This shouldn't happen unless the Keychain is seriously out of sync.
 * Show the React Native UI and pass it the failing credential indentity
 */
 - (void)prepareInterfaceToProvideCredentialForIdentity:(ASPasswordCredentialIdentity *)credentialIdentity
 {
     NSLog(@"BCUP_AF prepareInterfaceToProvideCredentialForIdentity");
     // Pass the serviceIdentifiers to the React Native app via the initialProperties initializer
     NSDictionary *initialProps = [NSDictionary dictionaryWithObject:[credentialIdentity recordIdentifier] forKey: @"credentialIdentity"];
     [self loadReactNativeUI: initialProps];
 }

@end
