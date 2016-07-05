describe('google', function () {

  it('should perform search', function () {
    return Promise.resolve()
      .then(() => page.navigate('https://www.google.com/ncr'))
      .then(() => wait.ms(500))
      .then(() => fiddler.start())
      .then(() => page.type('input[name="q"]', 'autotester'))
      .then(() => wait.ms(500))
      .then(() => page.click('button[name="btnG"]'))
      .then(() => wait.ms(500))
      .then(() => fiddler.stop())
      .then(() => fiddler.assert({
        urlStart: 'https://www.google.com/complete',
        urlParams: {q: 'autotester'}
      }))
  });

});


