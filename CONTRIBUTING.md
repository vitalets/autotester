# Contributing

Contribution is really appreciated.
Please follow the instructions below.

## Self testing
As Autotester is testing tool it can test itself.
Exactly for that there should be two instances of Autotester loaded in browser during development.
One is from `dist/unpacked-dev` - the DEV version built with selftests.
And second from `dist/unpacked` - the PROD version to be tested.
Mainly you work with DEV that runs tests over PROD and also easier to debug because of source maps.

## Development setup

1. Install [git](https://git-scm.com) and [node.js](https://nodejs.org) >= 6
2. Fork the repo and clone it:

   ```bash
   git clone https://github.com/<your_name>/autotester.git
   ```

3. Install needed npm packages:

   ```bash
   cd autotester
   npm i
   ```

4. Run dev watcher:

   ```bash
   npm run dev
   ```

5. Launch chrome and open `chrome://extensions` page
6. Enable *developer mode* checkbox
7. Load 2 unpacked extensions from `dist/unpacked-dev` and `dist/unpacked`
8. Now you can make changes in files and reload extensions to see the result
