export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        background:
          "linear-gradient(to bottom, oklch(0.438 0.134 264.4), oklch(0.503 0.085 237.5))",
      }}
    >
      <img
        src="/images/loader.svg"
        alt="Logo PKACOU"
        style={{
          width: 100,
          height: 100,
          borderRadius: "20%",
          objectFit: "cover",
          marginBottom: 20,
          animation: "spin 2s linear infinite",
        }}
      />

      {/* <div
        style={{
          width: 50,
          height: 50,
          border: "5px solid rgba(255,255,255,0.3)",
          borderTop: "5px solid #fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      /> */}

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
