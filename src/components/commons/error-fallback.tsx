import { openLink } from "@/routes/landing";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpenIcon,
  HomeIcon,
  MailIcon,
  MessageCircle,
  RefreshCw,
  Send,
} from "lucide-react";

type ErrorFallbackProps = {
  error?: Error | null;
  info?: { componentStack: string };
  reset: () => void;
};

export default function ErrorFallback({
  error,
  reset,
  info,
}: Readonly<ErrorFallbackProps>) {
  const isSystemError =
    error?.message?.toLowerCase().includes("tauri") ||
    error?.message?.toLowerCase().includes("electron") ||
    error?.message?.toLowerCase().includes("unsupported platform") ||
    error?.message?.toLowerCase().includes("failed to load") ||
    error?.message?.toLowerCase().includes("webgl") ||
    error?.message?.toLowerCase().includes("permission denied") ||
    error?.message?.toLowerCase().includes("vite") ||
    error?.message?.toLowerCase().includes("module build failed");

  const navigate = useNavigate();

  const allButtons = [
    // Boutons principaux
    {
      icon: <RefreshCw className="w-5 h-5 mr-2" />,
      text: "Retry",
      onClick: reset,
    },
    {
      icon: <HomeIcon className="w-5 h-5 mr-2" />,
      text: "Home Page",
      onClick: () => navigate({ to: "/" }),
    },
    {
      icon: <BookOpenIcon className="w-5 h-5 mr-2" />,
      text: "Sermons Page",
      onClick: () => navigate({ to: "/sermons" }),
    },
    // Boutons développeur
    {
      icon: <MailIcon className="w-5 h-5 mr-2" />,
      text: "Email Developer",
      onClick: () => openLink("mailto:aikpeachille55@gmail.com"),
    },
    {
      icon: <Send className="w-5 h-5 mr-2" />,
      text: "Telegram",
      onClick: () => openLink("https://t.me/AchoBestman"),
    },
    {
      icon: <MessageCircle className="w-5 h-5 mr-2" />,
      text: "WhatsApp",
      onClick: () => openLink("https://wa.me/22555475465"),
    },
  ];

  const mainButtons = allButtons.slice(0, 3);
  const devButtons = allButtons.slice(3);

  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    background: "white",
    color: "#2E7D32",
    border: "none",
    padding: "10px 15px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
    transition: "transform 0.1s",
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to bottom, oklch(0.438 0.134 264.4), oklch(0.503 0.085 237.5))",
        color: "white",
        textAlign: "center",
        fontFamily: "sans-serif",
        padding: "0 20px",
      }}
    >
      <img
        src="/images/loader.svg"
        alt="Logo PKACOU"
        style={{
          width: 80,
          height: 80,
          marginBottom: 20,
          animation: "spin 2s linear infinite",
        }}
      />

      <h1 style={{ fontSize: "1.5rem", marginBottom: 10 }}>
        {isSystemError
          ? "A system error has occurred."
          : "An error occurred in the application."}
      </h1>

      {error && (
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            maxWidth: 600,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <span className="text-amber-300">{error.message}</span>
          <br />
          {info && <pre>{info.componentStack}</pre>}
        </p>
      )}

      {/* Boutons principaux */}
      <div
        className="flex flex-wrap gap-3 justify-center mt-4"
        style={{ marginTop: 20 }}
      >
        {mainButtons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            style={buttonStyle}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {btn.icon}
            {btn.text}
          </button>
        ))}
      </div>

      {/* Espace développeur */}
      <div
        className="flex flex-wrap gap-3 justify-center mt-6"
        style={{ marginTop: 40 }}
      >
        {devButtons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            style={buttonStyle}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {btn.icon}
            {btn.text}
          </button>
        ))}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
