//
//  BCHelpersTests.m
//  Buttercup
//
//  Created by Perry Mitchell on 30/8/17.
//

/**
 * Copyright (c) 2017-present, Buttercup, Inc.
 *
 * This source code is licensed under the GNU GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <XCTest/XCTest.h>
#import "BCHelpers.h"

@interface BCHelpersTests : XCTestCase

@end

@implementation BCHelpersTests

- (void)setUp {
    [super setUp];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testConstantTimeCompareMatches {
    BOOL sameMatches = [BCHelpers constantTimeCompare:@"abc 123" toChallenger:@"abc 123"];
    XCTAssert(sameMatches);
}

- (void)testConstantTimeCompareNonMatches {
    BOOL differentDoesntMatch = [BCHelpers constantTimeCompare:@"123" toChallenger:@"another"];
    BOOL sameLengthDifferentDoesntMatch = [BCHelpers constantTimeCompare:@"xyz" toChallenger:@"zyx"];
    XCTAssert(!differentDoesntMatch);
    XCTAssert(!sameLengthDifferentDoesntMatch);
}

- (void)testHexStringFromDataReturnsCorrectly {
    NSData *exampleData = [@"sss tEEst!\n 112 data?^" dataUsingEncoding:NSUTF8StringEncoding];
    NSString *hexString = [BCHelpers hexStringFromData:exampleData];
    XCTAssert([hexString isEqualToString:@"737373207445457374210a2031313220646174613f5e"]);
}

@end
