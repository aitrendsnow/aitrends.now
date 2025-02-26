import { useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";

const EBOOK_DOWNLOAD_URL =
  "https://github.com/user-attachments/files/18716974/Mastering.DeepSeek_.Unleashing.Hidden.Features.Secret.Tricks.Powerful.Prompts.pdf";

const LOGO_PATH = "/aitrends.now/profile-image.webp";

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

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      console.log("Google Script Response:", response);

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
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        dialogClassName="simple-modal" // Custom class for styling
        aria-labelledby="modal-title"
      >
        <div className="position-absolute top-0 end-0 p-3">
          <Button
            variant="link"
            className="modal-close-btn"
            onClick={() => setShow(false)}
            aria-label="Close"
          >
            ✕
          </Button>
        </div>
        <Modal.Header className="simple-modal-header">
          <div className="d-flex flex-column align-items-center w-100">
            <div className="d-flex align-items-center gap-3 mb-2">
              <Image
                src={LOGO_PATH}
                alt="Ai Trends Logo"
                height={32}
                width={32}
                className="modal-logo"
              />
              <Modal.Title as="h5" id="modal-title" className="modal-title">
                Free eBook Download
              </Modal.Title>
            </div>
            <p className="small text-muted text-center mb-0">
              Thank you for being here. Our love for tech brought us here!
            </p>
          </div>
        </Modal.Header>
        <Modal.Body className="simple-modal-body">
          {!submitted ? (
            <Form onSubmit={handleSubmit} className="modal-form">
              <Form.Group controlId="name" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="modal-input"
                  aria-required="true"
                />
              </Form.Group>
              <Form.Group controlId="email" className="mb-4">
                <Form.Control
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="modal-input"
                  aria-required="true"
                />
              </Form.Group>
              <Button type="submit" className="modal-submit-btn">
                Get eBook
              </Button>
            </Form>
          ) : error ? (
            <div className="modal-message text-danger">
              <p>Oops! Something went wrong.</p>
              <p className="small">{errorMessage}</p>
            </div>
          ) : (
            <div className="modal-message text-success">
              <p>Thanks, {name}!</p>
              <p className="small">Your eBook is downloading...</p>
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
