import { useState, useRef, ReactNode, useEffect } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";

const EBOOK_DOWNLOAD_URL =
  "https://github.com/user-attachments/files/18716974/Mastering.DeepSeek_.Unleashing.Hidden.Features.Secret.Tricks.Powerful.Prompts.pdf";
const LOGO_PATH = "src/assets/profile-image.webp";
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzKz03CLv6V5lePGZpqOOj_Fp6-xP-sug01kXdbLncRuv_ayirbbWLRvB9jdmKA0e8zaA/exec";

const EbookDownload = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadReady, setDownloadReady] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      console.log("Google Script Response:", response);

      setDownloadReady(true);
      setSubmitted(false);
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

  const triggerDownload = () => {
    if (downloadLinkRef.current) {
      downloadLinkRef.current.click();
      setDownloadTriggered(true);
    }
  };

  useEffect(() => {
    if (downloadReady && !downloadTriggered) {
      triggerDownload();
    }
  }, [downloadReady, downloadTriggered]);

  let modalMessageContent: ReactNode = null;
  if (error) {
    modalMessageContent = (
      <div className="modal-message text-danger">
        <p>Oops! Something went wrong.</p>
        <p className="small">{errorMessage}</p>
      </div>
    );
  } else if (submitted) {
    modalMessageContent = <div className="modal-message">Loading...</div>;
  } else if (downloadReady) {
    modalMessageContent = (
      <div className="modal-message text-success">
        <p>Thanks, {name}!</p>
        <p className="small">Your eBook is ready for download.</p>
      </div>
    );
  }

  if (!isClient) return null;

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          setDownloadTriggered(false);
          setDownloadReady(false);
        }}
        centered
        dialogClassName="simple-modal"
        aria-labelledby="modal-title"
      >
        <div className="position-absolute top-0 end-0 p-3">
          <Button
            variant="link"
            className="modal-close-btn"
            onClick={() => {
              setShow(false);
              setDownloadTriggered(false);
              setDownloadReady(false);
            }}
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
          {!submitted && !downloadReady && !error ? (
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
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                />
              </Form.Group>
              <Button
                type="submit"
                className="modal-submit-btn"
                disabled={submitted}
              >
                {submitted ? "Loading..." : "Get eBook"}
              </Button>
            </Form>
          ) : (
            modalMessageContent
          )}
        </Modal.Body>
      </Modal>
      <a
        href={EBOOK_DOWNLOAD_URL}
        download="MasteringDeepSeek.pdf"
        style={{ display: "none" }}
        ref={downloadLinkRef}
      ></a>
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
