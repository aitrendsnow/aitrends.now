import { useState, useEffect, lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ProfileImage from "./assets/profile-image.webp";
// Suppress TypeScript unused variable warnings
// @ts-ignore
import BootstrapIconsWoff2 from "./assets/fonts/bootstrap-icons.woff2";
// @ts-ignore
import BootstrapIconsWoff from "./assets/fonts/bootstrap-icons.woff";

const EbookDownload = lazy(() => import("./components/EbookDownload"));

const isAppBrowser = (() => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
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
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    console.log("Theme set to:", theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    action?: string
  ) => {
    if (action === "triggerEbookDownload") {
      e.preventDefault();
      document.getElementById("ebook-download-trigger")?.click();
    }
  };

  const socialLinks = [
    {
      platform: "Threads",
      url: "https://threads.net/@aitrends.now",
      icon: "bi-threads",
    },
    {
      platform: "Bluesky",
      url: "https://bsky.app/profile/aitrendsnow.bsky.social",
      icon: "bi-chat-square-text",
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/aitrends.now",
      icon: "bi-instagram",
    },
    {
      platform: "Mastering Deepseek (eBook)",
      url: "#ebook",
      icon: "bi-book",
      action: "triggerEbookDownload",
    },
    {
      platform: "GitHub",
      url: "https://github.com/aitrendsnow/aitrends.now",
      icon: "bi-github",
      special: true,
    },
  ];

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
              srcSet={`${ProfileImage}?width=120`}
              media="(min-width: 1024px)"
              width="120"
              height="120"
            />
            <img
              src={ProfileImage}
              alt="Profile picture of aitrends.now"
              className="profile-image"
              loading="eager"
              width="80"
              height="80"
            />
          </picture>
          <h1 className="profile-username">aitrends.now</h1>
          <p className="profile-description">
            Tech enthusiast. Follow for updates & a shared love for tech.
          </p>
        </div>

        <div className="links-section">
          {socialLinks.map((link, index) => (
            <div
              className={`link-card ${link.special ? "special" : ""}`}
              key={index}
            >
              <a
                href={link.url}
                target={link.action ? "_self" : "_blank"}
                rel={link.action ? "" : "noopener noreferrer"}
                onClick={(e) => handleLinkClick(e, link.action)}
              >
                <i className={`bi ${link.icon}`}></i>
                <span>{link.platform}</span>
              </a>
              <span
                className="link-options"
                onClick={() => handleShare(link.platform, link.url)}
                role="button"
                tabIndex={0}
                aria-label={`Share ${link.platform} link`}
              >
                ⋮
              </span>
            </div>
          ))}
        </div>
        <Suspense fallback={<span>Loading eBook...</span>}>
          <EbookDownload />
        </Suspense>
      </div>

      <footer>
        <p>© {new Date().getFullYear()} aitrends.now. All rights reserved.</p>
      </footer>
    </div>
  );
}
