//
//  BCDerivationTests.m
//  ButtercupTests
//
//  Created by Perry Mitchell on 4.12.2021.
//

#import <XCTest/XCTest.h>
#import "BCDerivation.h"

@interface BCDerivationTests : XCTestCase

@end

@implementation BCDerivationTests

- (void)setUp {
    // Put setup code here. This method is called before the invocation of each test method in the class.
}

- (void)tearDown {
    // Put teardown code here. This method is called after the invocation of each test method in the class.
}

- (void)testDerivesSameKey {
  NSString *derivedKey1 = [BCDerivation deriveKeyFromPassword:@"test" andSalt:@"abc123def456" forRounds:10000 withBits:512];
  NSString *derivedKey2 = [BCDerivation deriveKeyFromPassword:@"test" andSalt:@"abc123def456" forRounds:10000 withBits:512];
  XCTAssertTrue([derivedKey1 isEqualToString:derivedKey2]);
}

- (void)testDerivationPerformance {
    // This is an example of a performance test case.
    [self measureBlock:^{
      [BCDerivation deriveKeyFromPassword:@"test" andSalt:@"abc123def456" forRounds:50000 withBits:512];
    }];
}

@end
