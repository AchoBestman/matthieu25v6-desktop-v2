// app-loader.tsx
import { ReactNode, useEffect, useState } from "react";

interface AppLoaderProps {
  children: ReactNode;
  duration?: number; // en ms
  onFinish?: () => void; // <-- ajouter cette prop
}

export default function AppLoader({
  children,
  duration = 10000,
  onFinish,
}: Readonly<AppLoaderProps>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    //termine le chargement de demarage des que le deuxiement chargement commence. cela permet de rendre l'ecran une fois prète
    onFinish?.();
  }, []);

  if (loading) {
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

  return <>{children}</>; // renvoie le reste de l'app
}
