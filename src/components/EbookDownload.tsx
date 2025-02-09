import { useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";

const EBOOK_DOWNLOAD_URL =
  "https://github.com/user-attachments/files/18716974/Mastering.DeepSeek_.Unleashing.Hidden.Features.Secret.Tricks.Powerful.Prompts.pdf";

const LOGO_PATH = "images/favicon.png";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzKz03CLv6V5lePGZpqOOj_Fp6-xP-sug01kXdbLncRuv_ayirbbWLRvB9jdmKA0e8zaA/exec";

const EbookDownload = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email) return;

    try {
      setSubmitted(true);
      setError(false);
      setErrorMessage("");

      console.log("Submitting data to Google Sheets:", { name, email });

      // ✅ Add `mode: "no-cors"` to temporarily bypass CORS
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // 🔥 Temporary fix to bypass CORS for Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      console.log("Google Script Response:", response); // Debugging line

      // ✅ Since `no-cors` blocks response, just assume success for now
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = EBOOK_DOWNLOAD_URL;
        link.download = "MasteringDeepSeek.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 2000);
    } catch (err) {
      const error = err as Error;
      console.error("Error submitting data:", error);
      setError(true);
      setErrorMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
      setSubmitted(false);
    }
  };

  return (
    <>
      <style type="text/css">
        {`
          .form-group-aligned {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 10px;
            align-items: center;
          }

          .form-group-aligned .form-label {
            text-align: right;
            padding-right: 10px;
          }

          .form-control-custom-placeholder::placeholder {
            color: lightgray;
            opacity: 1;
            font-size: inherit;
          }

          .form-control-custom-placeholder {
            font-size: inherit;
            padding-left: 10px;
          }
        `}
      </style>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        className="border-0"
      >
        <Modal.Header className="border-0 pb-0 d-flex flex-column align-items-center position-relative pt-3">
          <div className="position-absolute top-0 end-0 me-4 mt-4">
            <Button variant="close" onClick={() => setShow(false)} />
          </div>
          <div className="d-flex align-items-center mb-2 mt-2">
            <Image
              src={LOGO_PATH}
              alt="Ai Trends Logo"
              height={40}
              className="me-3"
            />
            <Modal.Title className="fw-bold fs-5">
              Get Your Free eBook
            </Modal.Title>
          </div>
          <p className="small text-muted text-center">
            Thank you for being here. Our love for tech brought us here!
          </p>
        </Modal.Header>
        <Modal.Body className="pt-3 pb-4 px-4">
          {!submitted ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name" className="mb-3 form-group-aligned">
                <Form.Label className="form-label">Full Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-0 rounded-0 shadow-none form-control-custom-placeholder"
                  style={{
                    borderBottom: "1px solid #ced4da",
                    fontSize: "inherit",
                  }}
                />
              </Form.Group>
              <Form.Group controlId="email" className="mb-4 form-group-aligned">
                <Form.Label className="form-label">Email Address:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 rounded-0 shadow-none form-control-custom-placeholder"
                  style={{
                    borderBottom: "1px solid #ced4da",
                    fontSize: "inherit",
                  }}
                />
              </Form.Group>
              <div className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-0 shadow-none"
                >
                  Submit
                </Button>
              </div>
            </Form>
          ) : error ? (
            <div className="text-center text-danger">
              <p className="mb-3">An error occurred. Please try again.</p>
              <p className="small">{errorMessage}</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-3">
                Thank you, {name}! Your eBook is being downloaded now.
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <button
        type="button"
        className="d-none"
        onClick={() => setShow(true)}
        id="ebook-download-trigger"
      ></button>
    </>
  );
};

export default EbookDownload;
