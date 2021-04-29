import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Form,
  Button,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { SHA256 } from "crypto-js";

const NewDiploma = (props) => {
  const [show, setShow] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);

  const [msg, setMsg] = useState();

  const handleClose = () => setShow(false);
  const [diplomaId, setDiplomaId] = useState("");
  const [expirationDate, setExpirationDate] = useState();
  const [noExpiration, SetNoExpiration] = useState(true);
  const [expInSeconds, setExpInSeconds] = useState(0);
  const [title, setTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [student, setStudent] = useState("");
  const [details, setDetails] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [minDate, setMinDate] = useState();
  const fileFrm = useRef();
  const resetForm = useRef();
  const diplomaIdFrm = useRef();
  const [inProgress, setInProgress] = useState(false);
  const generateId = () => {
    const uuid = uuidv4();
    setDiplomaId(uuid);
    diplomaIdFrm.current.value = uuid;
  };
  const clearFile = () => {
    fileFrm.current.value = "";
    setFileHash("");
  };
  const handleFileChosen = (file) => {
    if (!file) {
      setFileHash("");
      return;
    }
    setFileHash("Calculating hash...");
    const fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      setTimeout(() => setFileHash(SHA256(fileReader.result).toString()), 200);
    };
    fileReader.readAsBinaryString(file);
  };

  const createDiploma = async () => {
    if (
      !(await props.test_diploma({
        diplomaId,
        expInSeconds,
        title,
        institution,
        student,
        details,
        fileHash,
      }))
    ) {
      setShowTransaction(false);
      setMsg("Error creating the diploma, please verify the information");
      setShow(true);
      return;
    }

    setInProgress(true);

    if (
      await props.create_diploma({
        diplomaId,
        expInSeconds,
        title,
        institution,
        student,
        details,
        fileHash,
      })
    ) {
      setShowTransaction(false);
    } else {
      setInProgress(false);
      setShowTransaction(false);
      setMsg("Error creating the diploma, please verify the information");
      setShow(true);
    }
  };
  useEffect(() => {
    if (props.transaction_confirmed) {
      const clearData = () => {
        setDiplomaId("");
        setExpirationDate("");
        setExpInSeconds(0);
        setTitle("");
        setInstitution("");
        setStudent("");
        setDetails("");
        setFileHash("");
        clearFile();
        resetForm.current.click();
      };
	clearData();
	setInProgress(false);
      setShowTransaction(true);
    }
  }, [props.transaction_confirmed]);

  useEffect(() => {
    setMinDate(new Date().toISOString().substring(0, 19));
  }, []);

  useEffect(() => {
    setExpInSeconds(
      noExpiration || !expirationDate
        ? 0
        : Math.ceil(
            (new Date(expirationDate).getTime() - new Date().getTime()) / 1000
          )
    );
  }, [expirationDate, noExpiration]);

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
          <Form.Label>
            Diploma Id -{" "}
            <small onClick={generateId} style={{ cursor: "pointer" }}>
              Autogenerate
            </small>
          </Form.Label>
          <Form.Control
            ref={diplomaIdFrm}
            onChange={(e) => setDiplomaId(e.target.value)}
            type="text"
            placeholder="Enter id of the diploma"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Expiration Date -{" "}
            <small>
              <Form.Check
                custom
                inline
                label="No expiration"
                id={"expirationCheck"}
                checked={noExpiration}
                onChange={() => SetNoExpiration(!noExpiration)}
              />
            </small>
          </Form.Label>
          <Form.Control
            disabled={noExpiration}
            onChange={(e) => setExpirationDate(e.target.value)}
            type="datetime-local"
            step="1"
            min={minDate}
            // min="2021-01-01T00:00"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="e.g. Bachelor of Science"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Institution</Form.Label>
          <Form.Control
            onChange={(e) => setInstitution(e.target.value)}
            type="text"
            placeholder="e.g. Harvard University"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Student</Form.Label>
          <Form.Control
            onChange={(e) => setStudent(e.target.value)}
            type="text"
            placeholder="e.g. Doe, Jane"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Details</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. in Electrical Engineering, Summa Cum Laude"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Digital Diploma (Optional) -{" "}
            <small>
              file won't be uploaded, it is used to calculate its hash value
              using SHA256
            </small>
          </Form.Label>
          <Form.File
            ref={fileFrm}
            id="exampleFormControlFile1"
            onChange={(e) => handleFileChosen(e.target.files[0])}
          />

          {fileHash && (
            <Form.Control
              className="mt-2 mb-2"
              readOnly
              type="text"
              placeholder="File hash"
              value={fileHash}
            />
          )}
          {fileHash && fileHash !== "Calculating hash..." && (
            <Button onClick={clearFile} variant="secondary">
              Remove
            </Button>
          )}
        </Form.Group>
        <Form.Group className="text-center">
          {!inProgress && (
            <Button onClick={createDiploma} variant="success">
              Create Diploma
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
        <Form.Control
          type="reset"
          ref={resetForm}
          defaultValue="Reset"
          style={{ display: "none" }}
        />
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>{msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default NewDiploma;
