# Contributing

Contribution is really appreciated.
Please follow the instructions below.

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

5. Open chrome and load unpacked extension from `dist/unpacked-dev`.
6. Also load unpacked extension from `dist/unpacked-mirror`. This is copy of Autotester needed for self testing.
7. Now you can make changes in files and reload extension to see the result

## Self testing
As Autotester is testing tool it can test itself.
Exactly for that there should be two instances of Autotester loaded in browser during development.
One is from `dist/unpacked-dev` - the main runner you are working with.
And second from `dist/unpacked-mirror` - the instance being tested.
