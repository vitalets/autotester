# Contributing

Contribution is really appreciated.
Please follow the instructions below.

## Development setup

Currently development is only possible on OSX.

1. Install [node.js](https://nodejs.org) if not yet
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
6. Also load unpacked extension from `dist/unpacked-dev-selftest`. This is copy of Autotester needed for self testing.
7. Now you can make changes in files and reload extension to see the result
