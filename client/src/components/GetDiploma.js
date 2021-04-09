import React, { useState } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";

const _ = require("lodash");

const GetDiploma = (props) => {
  const [diplomaId, setDiplomaId] = useState("");
  const [error, setError] = useState(false);
  const [institution, setInstitution] = useState();
  const [diplomaData, setDiplomaData] = useState({});

  return (
    <Container>
      <Form className="user-select-none">
        <Form.Group>
          <Form.Label>Diploma Id</Form.Label>
          <Form.Control
            onChange={(e) => setDiplomaId(e.target.value)}
            type="text"
            placeholder="Enter id of the diploma"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Institution public address</Form.Label>
          <Form.Control
            onChange={(e) => setInstitution(e.target.value)}
            type="text"
            placeholder="e.g. 0xb794f5ea0ba39494ce839613fffba74279579268"
          />
        </Form.Group>
        <Form.Group className="text-center">
          <Button
            variant="success"
            onClick={async () => {
              const response = await props.get_diploma(diplomaId, institution);
              setDiplomaData(!response ? {} : response);
              setError(!response ? true : false);
            }}
          >
            Get Diploma
          </Button>
        </Form.Group>
      </Form>
      <>
        {!_.isEmpty(diplomaData) && (
          <p>
            {"Created on "}
            <strong>{`${new Date(
              parseInt(diplomaData["createdOn"]) * 1000
            )}`}</strong>
          </p>
        )}
        {!_.isEmpty(diplomaData) && (
          <p>
            {"Institution "}
            <strong>{diplomaData["institution"]}</strong>
          </p>
        )}
        {!_.isEmpty(diplomaData) && (
          <p>
            {"Student "}
            <strong>{diplomaData["beneficiary"]}</strong>
          </p>
        )}
        {!_.isEmpty(diplomaData) && (
          <p>
            {"Title "}
            <strong>{diplomaData["title"]}</strong>
          </p>
        )}
        {!_.isEmpty(diplomaData) && (
          <p>
            {"Details "}
            <strong>{diplomaData["details"]}</strong>
          </p>
        )}
        {!_.isEmpty(diplomaData) && diplomaData["PoEhash"] && (
          <p>
            {"Digital Diploma Hash (POF) "}
            <strong>{diplomaData["PoEhash"]}</strong>
          </p>
        )}
        {error && (
          <Alert variant="danger" onClose={() => setError(false)} dismissible>
            <Alert.Heading></Alert.Heading>
            <p>The diploma does not exists, or is invalid</p>
          </Alert>
        )}
      </>
    </Container>
  );
};
export default GetDiploma;
