# Gnoscan
Gnoscan is an opensource blockchain explorer for the Gnoland blockchain, aiming to make on-chain data readable and intuitive for everyone with a UI optimized for features unique to Gnoland such as Proof of Contributions (PoC), Realms (Smartcontract in Gno), GRC20s, and Boards.

## Project Overview
This repository hosts the codebase for the Gnoscan Interface. The interface is built using TypeScript and comes with rich features including a real-time dashboard for the Gnoland blockchain, recent blocks and transactions, details of realms, a full list of GRC20 tokens, and more.

## Development Setup
To set up the development environment, make sure you have Node.js version 18.14.2 installed. We recommend using [nvm](https://github.com/nvm-sh/nvm) for managing Node.js versions. Follow these steps:

```bash
# Install Node.js version 18.14.2 (if not already installed)
$ nvm install 18.14.2

# Use Node.js version 18.14.2
$ nvm use 18.14.2
```

This project uses `yarn` as an alternative to `npm`. If you don't have yarn installed, run the following command:
```bash
$ npm i yarn -g
```

Next, install the prerequisite packages:
```bash
$ yarn install
```

execute the following command:
```bash
$ cp .env.example .env
$ yarn dev
# Access http://localhost:3000
```


## Contributing & Support
If you would like to contribute to Gnoscan or need support, please consider the following options:
- Read our contributing guidelines: The [CONTRIBUTING.md](https://github.com/onbloc/gnoscan/blob/main/CONTRIBUTING.md) file provides detailed information on how to contribute to the project, including submitting pull requests, reporting issues, and suggesting improvements.
- Open an issue: If you encounter a bug, have a feature request, or want to suggest improvements, feel free to open an [issue](https://github.com/onbloc/gnoscan/issues) in this repository.
- Join our community: For discussions, questions, or support, join our [channel](https://discord.gg/A6SQamyeEJ) on Gnoland's Discord server. We're open to collaborations!

## License
This project is licensed under the [GNU General Public License, Version 3.0](LICENSE). See the [full text](https://www.gnu.org/licenses/gpl-3.0.en.html) for details.

