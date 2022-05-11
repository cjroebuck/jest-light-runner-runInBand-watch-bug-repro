export {};

describe("foo",() => {
    it('it runs JS as ESM', () => {
        console.log("RUNNING FOO.JS")
        expect(import.meta.url).toBeDefined();
        expect(1).toEqual(1);
    });
});