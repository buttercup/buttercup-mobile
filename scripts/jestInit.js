global.fetch = require("jest-fetch-mock");

jest.mock("Linking", () => {
    return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        openURL: jest.fn(),
        canOpenURL: jest.fn(),
        getInitialURL: jest.fn()
    };
});
