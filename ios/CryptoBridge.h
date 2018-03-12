//
//  CryptoBridge.h
//  Buttercup
//
//  Created by Perry Mitchell on 24/5/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
// #import <React/RCTBridgeModule.h>

#if __has_include(<React/RCTBridgeModule.h>)
    #import <React/RCTBridgeModule.h>
#else
    #import "RCTBridgeModule.h"
#endif

@interface CryptoBridge : NSObject <RCTBridgeModule>

@end
