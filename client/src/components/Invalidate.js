import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";

const _ = require("lodash");

const Invalidate = (props) => {
  const [diplomaId, setDiplomaId] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [diplomaData, setDiplomaData] = useState({});
  const [showTransaction, setShowTransaction] = useState(false);
  const [msg, setMsg] = useState();
  const [show, setShow] = useState(false);

  const invalidateAction = async () => {
    // Test action outcome .call()'
    setInProgress(true);
    if (!(await props.invalidate_diploma_test(diplomaId))) {
      setInProgress(false);
      setMsg("Error invalidating the diploma, please verify the diploma Id");
      setShow(true);
      return;
    } else {
      await props.invalidate_diploma(diplomaId);
    }
  };
  useEffect(() => {
    if (props.transaction_confirmed) {
      setInProgress(false);
      setShowTransaction(true);
    }
  }, [props.transaction_confirmed]);
  return (
    <Container>
      <Alert
        show={showTransaction}
        variant="success"
        onClose={() => setShowTransaction(false)}
        dismissible
      >
        <p>
          The operation was accepted!!. You will receive a notification once the
          transaction is confirmed
        </p>
      </Alert>
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
              onClick={invalidateAction}
              //  onClick={async () => {
              //    setInProgress(true);
              //    const response = await props.invalidate_diploma(diplomaId);
              //    setInProgress(false);
              //    setDiplomaData({ voided: response, diplomaId });
              //  }}
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

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>{msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default Invalidate;
