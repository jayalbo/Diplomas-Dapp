import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Diplomas from "./contracts/Diplomas.json";
import getWeb3 from "./getWeb3";
import { Container } from "react-bootstrap";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewContract from "./components/NewDiploma";
import GetDiploma from "./components/GetDiploma";
import Validate from "./components/Validate";
import Invalidate from "./components/Invalidate";
import POF from "./components/POF";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const App = () => {
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [depNetwork, setDepNetwork] = useState();
  const [txConfirmed, setTxConfirmed] = useState(false);

  const toastAlert = (message, type) => {
    toast[type](message);
  };
  useEffect(() => {
    (async () => {
      try {
        const web3 = await getWeb3(); // Get web3 instance.
        const accounts = await web3.eth.getAccounts(); // Get users accounts

        const networkId = await web3.eth.net.getId(); // Get network Id
        const networkType = await web3.eth.net.getNetworkType(); // Get Network type (e.g. mainnet,rinkeby, etc )

        // Contract
        const deployedNetwork = Diplomas.networks[networkId];
        const instance = new web3.eth.Contract(
          Diplomas.abi,
          deployedNetwork && deployedNetwork.address
        );

        setAccounts(accounts);
        setContract(instance);
        setDepNetwork(networkType);

        try {
          // Detect change of account on wallet (Metamask)
          window.ethereum.on("accountsChanged", async () => {
            // Set new account
            setAccounts(await web3.eth.getAccounts());
          });
          window.ethereum.on("chainChanged", async () => {
            // Set contract deployment & account on network change
            const deployedNetwork =
              Diplomas.networks[await web3.eth.net.getId()];

            setAccounts(await web3.eth.getAccounts());
            setContract(
              new web3.eth.Contract(
                Diplomas.abi,
                deployedNetwork && deployedNetwork.address
              )
            );
            setDepNetwork(await web3.eth.net.getNetworkType());
          });
        } catch (error) {
          console.log("Auto-detect network change not supported");
        }
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  }, []);
  const testCreateDiplomaAction = async (diplomaData) => {
    setTxConfirmed(false);
    // Verify the operation is valid call()
    const {
      diplomaId,
      expInSeconds,
      title,
      institution,
      student,
      details,
      fileHash,
    } = diplomaData;
    try {
      await contract.methods
        .createCert(
          diplomaId,
          expInSeconds,
          title,
          institution,
          student,
          details,
          fileHash
        )
        .call({ from: accounts[0] });
      return true;
    } catch (error) {
      return false;
    }
  };

  const createDiplomaAction = async (diplomaData) => {
    let response;
    try {
      const {
        diplomaId,
        expInSeconds,
        title,
        institution,
        student,
        details,
        fileHash,
      } = diplomaData;

      response = await contract.methods
        .createCert(
          diplomaId,
          expInSeconds,
          title,
          institution,
          student,
          details,
          fileHash
        )
        .send({ from: accounts[0] })
        .on("transactionHash", async (txhash) => {
          setTxConfirmed(txhash ? true : false);
        });
      console.log(response);
      toastAlert(
        <div>
          {`The transaction ...${response.transactionHash.slice(
            -5
          )} was confirmed! 🎉 `}
          {depNetwork !== "private" && (
            <>
              {`\n View on `}
              <a
                href={`https://${
                  depNetwork !== "main" ? `${depNetwork}.` : ""
                }etherscan.io/tx/${response.transactionHash}`}
              >
                {"Etherscan"}
              </a>
            </>
          )}
        </div>,
        "success"
      );
    } catch (error) {
      response = false;
    } finally {
      return response;
    }
  };
  const getDiplomaAction = async (certId, certAuth) => {
    let response;
    try {
      response = await contract.methods.getCert(certId, certAuth).call();
      return response;
    } catch (error) {
      response = false;
    } finally {
      return response;
    }
  };
  const validateDiplomaAction = async (certId, certAuth) => {
    let response;

    try {
      response = await contract.methods.certValid(certId, certAuth).call();

      return response;
    } catch (error) {
      response = false;
    } finally {
      return response;
    }
  };
  const pofAction = async (certId, certAuth, fileHash) => {
    let response;
    try {
      response = await contract.methods
        .proofOfExistence(certId, certAuth, fileHash)
        .call();
    } catch (error) {
      alert(error);
      response = false;
    } finally {
      return response;
    }
  };
  const invalidateDiplomaActionTest = async (certId) => {
    setTxConfirmed(false);
    let response;
    try {
      response = await contract.methods
        .voidCert(certId)
        .call({ from: accounts[0] });
    } catch (error) {
      response = false;
    } finally {
      return response;
    }
  };
  const invalidateDiplomaAction = async (certId) => {
    let response;
    try {
      response = await contract.methods
        .voidCert(certId)
        .send({ from: accounts[0] })
        .on("transactionHash", async (txhash) => {
          setTxConfirmed(txhash ? true : false);
        });
    } catch (error) {
      response = false;
    } finally {
      return response;
    }
  };
  return (
    <Router>
      <Header accounts={accounts} />
      <Container className="mb-5">
        <Switch>
          <Route path="/get_diploma">
            <GetDiploma get_diploma={getDiplomaAction} />
          </Route>
          <Route path="/validate/:dId">
            <Validate
              validate_diploma={validateDiplomaAction}
              contract={contract}
            />
          </Route>
          <Route path="/validate">
            <Validate validate_diploma={validateDiplomaAction} />
          </Route>
          <Route path="/pof">
            <POF proof_of_existence={pofAction} />
          </Route>
          <Route path="/invalidate_diploma">
            <Invalidate
              transaction_confirmed={txConfirmed}
              invalidate_diploma={invalidateDiplomaAction}
              invalidate_diploma_test={invalidateDiplomaActionTest}
            />
          </Route>

          <Route path="/">
            <NewContract
              create_diploma={createDiplomaAction}
              test_diploma={testCreateDiplomaAction}
              transaction_confirmed={txConfirmed}
            />
          </Route>
        </Switch>
      </Container>
      <Footer depNetwork={depNetwork} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};
export default App;
