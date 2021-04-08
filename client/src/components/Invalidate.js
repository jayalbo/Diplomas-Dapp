import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

const _ = require("lodash");

const Invalidate = (props) => {
  const [diplomaId, setDiplomaId] = useState();
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
        <Form.Group></Form.Group>
        <Form.Group className="text-center">
          <Button
            variant="success"
            onClick={async () => {
              const response = await props.invalidate_diploma(diplomaId);
              setDiplomaData({ voided: response, diplomaId });
            }}
          >
            Invalidate Diploma
          </Button>
        </Form.Group>
      </Form>
      {!_.isEmpty(diplomaData) && diplomaData.voided && (
        <Alert variant={"secondary"}>
          The diploma <strong>{diplomaData.diplomaId}</strong> was invalidated
          succesfully.
        </Alert>
      )}
      {!_.isEmpty(diplomaData) && !diplomaData.voided && (
        <Alert variant={"danger"}>
          There was an error invalidating the diploma{" "}
          <strong>{diplomaData.diplomaId}</strong>, please verify the diploma
          Id.
        </Alert>
      )}
    </Container>
  );
};
export default Invalidate;
