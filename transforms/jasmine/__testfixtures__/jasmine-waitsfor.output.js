
describe('my awesome test suite', function() {

    it('my awesome spec', function(done) {
        doSomethingAsync(function callback() {
            expect(true).toBeTruthy();
            done();
        });
    });
});
