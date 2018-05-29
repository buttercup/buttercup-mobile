import { getDomain } from "../source/library/helpers.js";

describe("getDomain", () => {
    test("plucks the domain from a URL", () => {
        const domain = getDomain("https://www.somedomain.com/test-route/");
        expect(domain).toBe("www.somedomain.com");
    });
});
