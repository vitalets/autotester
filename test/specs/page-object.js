/**
 * Page object
 */

// todo: forbid props:
/*
* @typedef {(
*     {className: string}|
*     {css: string}|
*     {id: string}|
*     {js: string}|
*     {linkText: string}|
*     {name: string}|
*     {partialLinkText: string}|
*     {tagName: string}|
*     {xpath: string})}
*
*/


const page = {
  tabHeaders: {
    _: '.mdl-tabs__tab-bar',
    files: 'a:nth-child(1)',
    report: 'a:nth-child(2)',
    settings: 'a:nth-child(3)',
  },
  files: {
    noSelection: {
      _: '.no-file-selected',
      button: 'button'
    },
    editor: {
      _: '#editor',
      filename: '.mdl-textfield__input',
      code: '.ReactCodeMirror textarea',
      buttons: {
        create: '[data-test-id="create"]',
        delete: '[data-test-id="delete"]',
      }
    }
  },
  report: {
    _: '.report-tab',
    console: '.console',
    mochaStats: {
      _: '#mocha-stats',
      failures: '.failures em',
      passes: '.passes em',
    },
    error: '#mocha-report .error'
  },
  settings: {
    _: '.settings-content',
    filesSource: {
      _: '.settings-tests-source',
      url: {
        label: '.tests-source-url-radio .mdl-radio__label span'
      }
    }
  },
  runButton: '#run',
  filesDropdown: {
    _: '#tests',
    value: '.dropdown__value',
    items: 'ul li',
    item: 'ul li:nth-child({param})'
  }
};

function createPageObject(obj, parentCss = '') {
  const resCss = concatSelectors(parentCss, obj._);
  const res = obj._ === undefined ? {} : {css: resCss};
  Object.keys(obj).forEach(key => {
    if (key !== '_' && typeof obj[key] === 'string') {
      const matches = obj[key].match(/\{param\}/);
      if (matches) {
        res[key] = function (param) {
          const css = obj[key].replace('{param}', param);
          return {css: concatSelectors(resCss, css)};
        };
      } else {
        res[key] = {
          css: concatSelectors(resCss, obj[key])
        };
      }
    } else if (obj[key] && typeof obj[key] === 'object') {
      res[key] = createPageObject(obj[key], resCss)
    }
  });
  return res;
}

function concatSelectors(selector1, selector2) {
  selector1 = typeof selector1 === 'string' ? selector1 : '';
  selector2 = typeof selector2 === 'string' ? selector2 : '';
  const space = selector1 && selector2 && selector2.charAt(0) !== ':' ? ' ' : '';
  return `${selector1}${space}${selector2}`;
}

runContext.page = createPageObject(page);
