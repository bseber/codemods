
describe('my awesome test suite', function() {

    it('my awesome spec', function() {
        var done = false;

        doSomethingAsync(function callback() {
            expect(true).toBeTruthy();
            done = true;
        });

        waitsFor (function () { return done; });
    });
});
