describe('google', function () {

  it('should show results for normal search', function () {
    return Promise.resolve()
      .then(() => page.navigate('https://www.google.com/ncr'))
      .then(() => wait.ms(1000))
      .then(() => fiddler.start())
      .then(() => page.type('input[name="q"]', 'kitten'))
      .then(() => wait.ms(1000))
      .then(() => page.click('button[name="btnG"]'))
      .then(() => wait.ms(1500))
      .then(() => fiddler.stop())
      .then(() => page.assertVisible('a[href="https://en.wikipedia.org/wiki/Kitten"]'))
      .then(() => fiddler.assert({
        urlStart: 'https://www.google.com/complete',
        urlParams: {q: 'kitten'}
      }))
  });

  it('should not show results for abracadabra', function () {
    return Promise.resolve()
      .then(() => page.navigate('https://www.google.com/ncr'))
      .then(() => wait.ms(1000))
      .then(() => fiddler.start())
      .then(() => page.type('input[name="q"]', 'jkerfjkasfg5jahsdlfkqfqkj2dfnaklfnanjqaw3fklqwncdfgjkq1bwcfv'))
      .then(() => wait.ms(1000))
      .then(() => page.click('button[name="btnG"]'))
      .then(() => wait.ms(1500))
      .then(() => fiddler.stop())
      .then(() => page.assertVisible('#resultStats', false))
      .then(() => fiddler.assert({
        urlStart: 'https://www.google.com/complete',
        urlParams: {q: 'jkerfjkasfg5jahsdlfkqfqkj2dfnaklfnanjqaw3fklqwncdfgjkq1bwcfv'}
      }))
  });

});


