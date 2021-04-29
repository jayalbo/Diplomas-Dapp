// import getWeb3 from "./getWeb3";

// const DiplomaService = async () => {
// const web3 = await getWeb3(); // Get web3 instance.
// const accounts = await web3.eth.getAccounts(); // Get users accounts

// const networkId = await web3.eth.net.getId(); // Get network Id
// const networkType = await web3.eth.net.getNetworkType(); // Get Network type (e.g. mainnet,rinkeby, etc )

// // Contract
// const deployedNetwork = Diplomas.networks[networkId];
// const instance = new web3.eth.Contract(
//   Diplomas.abi,
//   deployedNetwork && deployedNetwork.address
// );

// const getDiploma = async () => {
//   let response;
//   try {
//     response = await contract.methods.getCert(certId, certAuth).call();
//     return response;
//   } catch (error) {
//     response = false;
//   } finally {
//     return response;
//   }
// };

// const getAccounts = () => accounts;
// const getNetworkType = () => accounts;

// export default DiplomaService;
