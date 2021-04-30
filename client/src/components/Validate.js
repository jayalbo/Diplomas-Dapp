import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router";

const _ = require("lodash");

const Validate = (props) => {
  const { dId } = useParams();
  const [diplomaId, setDiplomaId] = useState();
  const [institution, setInstitution] = useState();
  const [diplomaData, setDiplomaData] = useState({});
  const diplomaIdFrm = useRef();
  const institutionIdFrm = useRef();
  const btnSubmit = useRef();

  useEffect(() => {
    if (dId && props.contract) {
      const dipId = dId.split("@")[0];
      const instId = dId.split("@")[1];

      setDiplomaId(dipId);
      setInstitution(instId);
      diplomaIdFrm.current.value = dipId;
      institutionIdFrm.current.value = instId;
      (async () => {
        const response = await props.validate_diploma(dipId, instId);

        setDiplomaData({
          isValid: response,
          diplomaId: dipId,
          institution: instId,
        });
      })();
    }
  }, [dId, props.contract]);

  return (
    <Container>
      <Form className="user-select-none">
        <Form.Group>
          <Form.Label>Diploma Id</Form.Label>
          <Form.Control
            onChange={(e) => setDiplomaId(e.target.value)}
            type="text"
            placeholder="Enter id of the diploma"
            ref={diplomaIdFrm}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Institution public address</Form.Label>
          <Form.Control
            onChange={(e) => setInstitution(e.target.value)}
            type="text"
            placeholder="e.g. 0xb794f5ea0ba39494ce839613fffba74279579268"
            ref={institutionIdFrm}
          />
        </Form.Group>
        <Form.Group className="text-center">
          <Button
            variant="success"
            onClick={async () => {
              if (!diplomaId || !institution) return;
              const response = await props.validate_diploma(
                diplomaId,
                institution
              );
              setDiplomaData({ isValid: response, diplomaId, institution });
            }}
            ref={btnSubmit}
          >
            Validate Diploma
          </Button>
        </Form.Group>
      </Form>
      {!_.isEmpty(diplomaData) && (
        <Alert variant={diplomaData["isValid"] ? "success" : "danger"}>
          {diplomaData["isValid"] ? "✅ " : "❌"}{" "}
          <span className="ml-3">
            The diploma <strong>{diplomaData["diplomaId"]}</strong> from the
            institution <strong>{diplomaData["institution"]}</strong> is{" "}
            <strong className="diplomaValid">
              {diplomaData["isValid"] ? "Valid!" : "Not valid"}
            </strong>
          </span>
        </Alert>
      )}
    </Container>
  );
};
export default Validate;
