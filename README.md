## Final Project CSCI E-118 (HES) - Demonstration Portion

### Jay Albo

---

Live Demo (Rinkeby): https://diplomasdapp.jayalbo.dev/

Contract Address (Rinkeby) 0x26DE54fc152e7e5c24c939714C686709b342984d (https://rinkeby.etherscan.io/address/0x26DE54fc152e7e5c24c939714C686709b342984d)

---

### Requirements

#### **Truffle**

https://github.com/trufflesuite/truffle

**Installation**

- Via npm:
  npm install truffle -g

---

#### **Ganache**

https://github.com/trufflesuite/ganache

- Instalation:

  https://github.com/trufflesuite/ganache/releases

### Instructions

In order to run this application, please follow these steps:

1. Install the dependencies (Truffle and Ganache).
2. Clone the repository:
   - $ git clone git@github.com:jayalbo/cscie118-final.git
3. Within the project directory, run **$ npm install** to resolve its dependencies.
4. Compile the contracts from the terminal running the following command
   - $ truffle compile
5. **OPTIONAL** "deploy to Rinkeby" - Set your envvars by creating a .env file within the project root directory and setting the following vars
   - PROJECT_ID= -Your Infura Project Id- (Rinkeby testnet)
   - SEED_PHRASE= -Your seed phrase-
   - Run **$ truffle migrate --network rinkeby**
6. Deploy to local Ganache
   - Open Ganache
   - Create a new Workspace
   - From "Contracts" click "LINK TRUFFLE PROJECTS"
   - Click Add Project and select "truffle-config.js" from the project root directory
   - Click Save and Restart
7. From the terminal run **$ truffle migrate**
8. Finally from the project root navigate to /clients and run **$ npm start** or **react-scripts start**
9. **OPTIONAL** - "Build" - To build the project in order to deploy it to an external server run the following command **$ npm run build** or **react-scripts build**
