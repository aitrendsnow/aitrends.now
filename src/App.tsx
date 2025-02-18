// App.tsx
import { useState, useEffect, lazy, Suspense } from "react"; // Remove React import
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

const EbookDownload = lazy(() => import("./components/EbookDownload"));

const isAppBrowser = (() => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    //For server side
    return false;
  }
  const userAgent =
    navigator.userAgent || (navigator as any).vendor || (window as any).opera;
  return (
    userAgent.includes("Instagram") ||
    userAgent.includes("Threads") ||
    userAgent.includes("FB")
  );
})();

export default function App() {
  const [theme, setTheme] = useState("light"); // Initial state

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []); // Empty dependency array: runs only once after mount

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]); // This effect runs whenever 'theme' changes

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light")); // Use functional update
  };

  const handleShare = async (title: string, url: string): Promise<void> => {
    if (!isAppBrowser && navigator.share) {
      try {
        await navigator.share({ title, url });
        console.log("Content shared successfully");
      } catch (error: any) {
        // Type 'any' for the error, as its structure varies
        console.error("Error sharing content:", error);
        if (error.name !== "AbortError") {
          console.error("Share failed:", error);
          alert("Sharing failed. Please try again.");
        }
      }
    } else {
      console.log("Native share sheet should handle sharing.");
    }
  };

  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <button
        onClick={toggleTheme}
        className="theme-switcher-btn position-absolute top-0 end-0 m-3"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <i className="bi bi-moon-fill" aria-hidden="true"></i>
        ) : (
          <i className="bi bi-sun-fill" aria-hidden="true"></i>
        )}
      </button>

      <div className="main-content flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center">
        <div className="profile-section">
          <img
            src="/aitrends.now/profile-image.webp"
            alt="Profile picture of aitrends.now"
            className="profile-image"
            loading="lazy"
          />
          <h1 className="profile-username">aitrends.now</h1>
          <p className="profile-description">
            Tech enthusiast. Follow for updates & a shared love for tech.
          </p>
        </div>

        <div className="links-section">
          <div className="link-card">
            <a
              href="https://threads.net/@aitrends.now"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <i className="bi bi-threads"></i>
              {}
              <span>Threads</span>
              {}
            </a>
            <span
              className="link-options"
              onClick={() =>
                handleShare("Threads", "https://threads.net/@aitrends.now")
              }
              role="button"
              tabIndex={0}
              aria-label="Share Threads link"
            >
              ⋮
            </span>
          </div>

          <div className="link-card">
            <a
              href="https://bsky.app/profile/aitrendsnow.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 511.999 452.266"
                width="24"
                height="24"
                aria-label="Bluesky"
              >
                <path
                  d="M110.985 30.442c58.695 44.217 121.837 133.856 145.013 181.961 23.176-48.105 86.322-137.744 145.016-181.961 42.361-31.897 110.985-56.584 110.985 21.96 0 15.681-8.962 131.776-14.223 150.628-18.272 65.516-84.873 82.228-144.112 72.116 103.55 17.68 129.889 76.238 73 134.8-108.04 111.223-155.288-27.905-167.385-63.554-3.489-10.262-2.991-10.498-6.561 0-12.098 35.649-59.342 174.777-167.382 63.554-56.89-58.562-30.551-117.12 72.999-134.8-59.239 10.112-125.84-6.6-144.112-72.116C8.962 184.178 0 68.083 0 52.402c0-78.544 68.633-53.857 110.985-21.96z"
                  fill="#0085FF"
                />
              </svg>
              <span>Bluesky</span>
            </a>
            <span
              className="link-options"
              onClick={() =>
                handleShare("Bluesky", "https://bluesky.social/@aitrends.now")
              }
              role="button"
              tabIndex={0}
              aria-label="Share Bluesky link"
            >
              ⋮
            </span>
          </div>

          <div className="link-card">
            <a
              href="https://instagram.com/aitrends.now"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <i className="bi bi-instagram"></i>
              {}
              <span>Instagram</span>
              {}
            </a>
            <span
              className="link-options"
              onClick={() =>
                handleShare("Instagram", "https://instagram.com/aitrends.now")
              }
              role="button"
              tabIndex={0}
              aria-label="Share Instagram link"
            >
              ⋮
            </span>
          </div>

          <div className="link-card">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                document.getElementById("ebook-download-trigger")?.click(); // Trigger modal
              }}
            >
              <i className="bi bi-book"></i>
              <span>Mastering Deepseek (eBook)</span>
            </a>
            <span
              className="link-options"
              onClick={() =>
                handleShare("Download your eBook", "https://aitrends.now/ebook")
              }
              role="button"
              tabIndex={0}
              aria-label="Share eBook link"
            >
              ⋮
            </span>

            {/* Wrap EbookDownload with Suspense */}
            <Suspense fallback={<div>Loading eBook download...</div>}>
              <EbookDownload />
            </Suspense>
          </div>

          <div className="link-card special">
            <a
              href="https://github.com/aitrendsnow/aitrends.now"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <i className="bi bi-github"></i> {}
              <span>View Source on GitHub</span> {}
            </a>
            <span
              className="link-options"
              onClick={() =>
                handleShare(
                  "View Source on GitHub",
                  "https://github.com/aitrendsnow/aitrends.now"
                )
              }
              role="button"
              tabIndex={0}
              aria-label="Share GitHub link"
            >
              ⋮
            </span>
          </div>
        </div>
      </div>

      <Suspense fallback={<div>Loading Footer...</div>}>
        <footer style={{ fontSize: "0.75rem" }}>
          <p>
            &copy; {new Date().getFullYear()} aitrends.now. All rights reserved.
          </p>
        </footer>
      </Suspense>
    </div>
  );
}
