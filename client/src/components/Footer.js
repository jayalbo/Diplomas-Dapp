import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faEthereum } from "@fortawesome/free-brands-svg-icons";

import { Navbar } from "react-bootstrap";

const Footer = (props) => {
  return (
    <Navbar fixed="bottom" className="bottom-bar bg-secondary">
      <FontAwesomeIcon className="mr-1" icon={faEthereum} /> Connected to
      network <strong className="ml-2">{props.depNetwork}</strong>{" "}
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        HES - CSCI E-118 - Final Project - Jay Albo
        {/* <a href="https://github.com/jayalbo">
          <FontAwesomeIcon className="ml-2 icon_bar" icon={faGithub} />
        </a> */}
      </Navbar.Collapse>
    </Navbar>
  );
};
export default Footer;
