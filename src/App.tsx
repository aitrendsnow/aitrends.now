import { useState, useEffect, lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

const EbookDownload = lazy(() => import("./components/EbookDownload"));

const isAppBrowser = (() => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false; // Server-side rendering safeguard
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
  const [theme, setTheme] = useState("light");
  const [hydrateLCP, setHydrateLCP] = useState(false); // State for LCP hydration

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => setHydrateLCP(true));
    } else {
      setTimeout(() => setHydrateLCP(true), 100);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleShare = async (title: string, url: string): Promise<void> => {
    if (!isAppBrowser && navigator.share) {
      try {
        await navigator.share({ title, url });
        console.log("Content shared successfully");
      } catch (error: any) {
        console.error("Error sharing content:", error);
        if (error.name !== "AbortError") {
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
          <picture>
            <source
              srcSet="/aitrends.now/profile-image.webp"
              media="(min-width: 1024px)"
              width="150"
              height="150"
            />
            <source
              srcSet="/aitrends.now/profile-image.webp"
              width="100"
              height="100"
            />
            <img
              src="/aitrends.now/profile-image.webp"
              alt="Profile picture of aitrends.now"
              className="profile-image"
              loading="lazy"
              width="100"
              height="100"
            />
          </picture>

          <h1 className="profile-username">aitrends.now</h1>

          {/* Lazy-Hydrate Profile Description */}
          {hydrateLCP ? (
            <p className="profile-description">
              Tech enthusiast. Follow for updates & a shared love for tech.
            </p>
          ) : (
            <p className="profile-description">
              Tech enthusiast. Follow for updates & a shared love for tech.
            </p>
          )}
        </div>

        <div className="links-section">
          <div className="link-card">
            <a
              href="https://threads.net/@aitrends.now"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-threads"></i>
              <span>Threads</span>
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
              <i className="bi bi-chat-square-text"></i>
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
              <i className="bi bi-instagram"></i>
              <span>Instagram</span>
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
                e.preventDefault();
                document.getElementById("ebook-download-trigger")?.click();
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
          </div>

          <div className="link-card special">
            <a
              href="https://github.com/aitrendsnow/aitrends.now"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-github"></i>
              <span>View Source on GitHub</span>
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
        {/* Wrap EbookDownload with Suspense */}
        <Suspense fallback={<div>Loading eBook download...</div>}>
          <EbookDownload />
        </Suspense>
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
