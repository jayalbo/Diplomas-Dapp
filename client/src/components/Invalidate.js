import React, { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

const _ = require("lodash");

const Invalidate = (props) => {
  const [diplomaId, setDiplomaId] = useState();
  const [inProgress, setInProgress] = useState(false);
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
          {!inProgress && (
            <Button
              variant="success"
              onClick={async () => {
                setInProgress(true);
                const response = await props.invalidate_diploma(diplomaId);
                setInProgress(false);
                setDiplomaData({ voided: response, diplomaId });
              }}
            >
              Invalidate Diploma
            </Button>
          )}
          {inProgress && (
            <Button variant="success" disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Waiting for confirmation...
            </Button>
          )}
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
