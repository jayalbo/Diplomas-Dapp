import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Diplomas from "./contracts/Diplomas.json";
import getWeb3 from "./getWeb3";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import "./App.css";
import NewContract from "./components/NewDiploma";
import GetDiploma from "./components/GetDiploma";
import Validate from "./components/Validate";
import Invalidate from "./components/Invalidate";
import POF from "./components/POF";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  //const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [depNetwork, setDepNetwork] = useState();

  useEffect(() => {
    (async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const networkType = await web3.eth.net.getNetworkType();

        const deployedNetwork = Diplomas.networks[networkId];
        const instance = new web3.eth.Contract(
          Diplomas.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.

        // setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);
        setDepNetwork(networkType);

        //this.setState({ web3, accounts, contract: instance }, this.runExample);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  }, []);
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
        .send({ from: accounts[0] });
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

  const invalidateDiplomaAction = async (certId) => {
    let response;
    try {
      response = await contract.methods
        .voidCert(certId)
        .send({ from: accounts[0] });
    } catch (error) {
      response = false;
    } finally {
      return response;
    }
  };
  return (
    <Router>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="mb-3"
      >
        <Navbar.Brand>
          <FontAwesomeIcon className="mr-2" icon={faGraduationCap} />
          Diplomas DApp
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="mr-auto">
            <NavDropdown title="Actions" id="collasible-nav-dropdown">
              <NavDropdown.Item>
                <Link to="/" className="header_links_menu">
                  Create Diploma
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to="/get_diploma" className="header_links_menu">
                  Get Diploma
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to="/invalidate_diploma" className="header_links_menu">
                  Invalidate Diploma
                </Link>
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Validations" id="collasible-nav-dropdown">
              <NavDropdown.Item>
                <Link to="/validate" className="header_links_menu">
                  Validate Diploma
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to="/pof" className="header_links_menu">
                  Proof of existence
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Navbar.Text>
            Signed in as: <span className="text-white">{accounts}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Container className="mb-5">
        <Switch>
          <Route path="/get_diploma">
            <GetDiploma get_diploma={getDiplomaAction} />
          </Route>
          <Route path="/validate">
            <Validate validate_diploma={validateDiplomaAction} />
          </Route>
          <Route path="/pof">
            <POF proof_of_existence={pofAction} />
          </Route>
          <Route path="/invalidate_diploma">
            <Invalidate invalidate_diploma={invalidateDiplomaAction} />
          </Route>
          <Route path="/">
            <NewContract create_diploma={createDiplomaAction} />
          </Route>
        </Switch>
      </Container>
      <Navbar fixed="bottom" className="bottom-bar bg-secondary">
        <FontAwesomeIcon className="mr-1" icon={faEthereum} /> Connected to
        network <strong className="ml-2">{depNetwork}</strong> <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <a href="https://github.com/jayalbo">
            <FontAwesomeIcon className="ml-2 icon_bar" icon={faGithub} />
          </a>
        </Navbar.Collapse>
      </Navbar>
    </Router>
  );
};

// class App extends Component {
//   state = { storageValue: 0, web3: null, accounts: null, contract: null };

//   componentDidMount = async () => {
//   };

//   runExample = async () => {
//     const { accounts, contract } = this.state;

//     // Stores a given value, 5 by default.
//     await contract.methods.set(5).send({ from: accounts[0] });

//     // Get the value from the contract to prove it worked.
//     const response = await contract.methods.get().call();

//     // Update state with the result.
//     this.setState({ storageValue: response });
//   };

//   render() {
//     if (!this.state.web3) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//         <h1>Good to Go!!!!</h1>
//         <p>Your Truffle Box is installed and ready.</p>
//         <h2>Smart Contract Example</h2>
//         <p>
//           If your contracts compiled and migrated successfully, below will show
//           a stored value of 5 (by default).
//         </p>
//         <p>
//           Try changing the value stored on <strong>line 40</strong> of App.js.
//         </p>
//         <div>The stored value is: {this.state.storageValue}</div>
//       </div>
//     );
//   }
// }

export default App;
