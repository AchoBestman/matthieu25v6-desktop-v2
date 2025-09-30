// routes/_landing/landing.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Facebook, Youtube } from "lucide-react";
export const Route = createFileRoute("/landing")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const languages = [
    { code: "fr", flag: "🇫🇷", name: "Français", url: "/fr" },
    { code: "en", flag: "🇬🇧", name: "English", url: "/en" },
    { code: "es", flag: "🇪🇸", name: "Español", url: "/es" },
    { code: "pt", flag: "🇵🇹", name: "Português", url: "/pt" },
    { code: "sw", flag: "🇰🇪", name: "Swahili", url: "/sw" },
    { code: "multi", flag: "🌍", name: "Multi-langues", url: "/multi" },
    { code: "zh", flag: "🇨🇳", name: "中文", url: "/zh" },
    { code: "hi", flag: "🇮🇳", name: "हिन्दी", url: "/hi" },
    { code: "ar", flag: "🇸🇦", name: "العربية", url: "/ar" },
    { code: "fa", flag: "🇮🇷", name: "فارسی", url: "/fa" },
  ];

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat w-full"
      style={{
        backgroundImage: `url('/images/landing-image.jpg')`,
      }}
    >
      {/* Header */}
      <div className="bg-indigo-900 text-white py-4 px-6 flex items-center justify-between shadow-lg">
        <h1 className="text-xl font-semibold">Prophète Kacou - v. 5.10.16</h1>
        <Link
          to="/sermons"
          className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
        >
          <Home size={20} />
          Accueil
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Language Selection */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl py-6 px-4 mb-6">
          <p className="text-center text-blue-900 font-semibold text-lg mb-4">
            Cliquez sur votre langue (Drapeau)
          </p>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => (window.location.href = lang.url)}
                className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-200"
                title={lang.name}
              >
                <span className="text-4xl md:text-5xl mb-1">{lang.flag}</span>
                <span className="text-xs text-gray-600 text-center">
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Banner Image */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden mb-6">
          <div className="relative">
            {/* Header text on banner */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-center py-4 px-4">
              <h2 className="text-yellow-400 text-2xl md:text-3xl font-bold">
                Des miracles et guérisons
              </h2>
              <h3 className="text-white text-xl md:text-2xl font-semibold uppercase tracking-wider mt-1">
                DU PROPHÈTE KACOU PHILIPPE
              </h3>
              <p className="text-yellow-300 text-lg md:text-xl font-bold mt-1">
                CONFIRMANT SON MESSAGE
              </p>
            </div>

            {/* Images Section */}
            <div className="grid grid-cols-2 gap-0 bg-white">
              {/* Left side - Man with wheelchair and crowd */}
              <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-5xl md:text-7xl mb-4">♿</div>
                    <p className="text-gray-700 text-sm md:text-base italic font-medium">
                      Avant la guérison
                    </p>
                    <p className="text-gray-600 text-xs md:text-sm mt-2">
                      Fauteuil roulant
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Man healed with crutches */}
              <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-5xl md:text-7xl mb-4">🎉</div>
                    <p className="text-gray-800 font-bold text-lg md:text-2xl">
                      Guérison miraculeuse!
                    </p>
                    <div className="text-6xl md:text-8xl mt-4">🩼</div>
                    <p className="text-gray-700 text-sm md:text-base mt-2">
                      Béquilles levées en victoire
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white py-4 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 border-t px-4">
              <a
                href="https://www.facebook.com/ProphetKacouPhilippe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                <Facebook size={24} />
                <span className="font-semibold">Prophète Kacou Philippe</span>
              </a>
              <a
                href="https://www.youtube.com/@PKP_TheVoiceOfHealing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors font-medium"
              >
                <Youtube size={24} />
                <span className="font-semibold">@PKP_TheVoiceOfHealing</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bible Verse Quote */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8 mb-6">
          <p className="text-blue-900 text-base md:text-xl leading-relaxed italic text-center font-medium">
            "Ma parole et ma prédication n'ont pas consisté en paroles
            persuasives de sagesse, mais en démonstration de l'Esprit et de
            puissance".
          </p>
          <p className="text-right text-blue-800 font-bold mt-4 text-base md:text-lg">
            1Cor 2:4, 1Cor 4:20
          </p>
        </div>

        {/* Share Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl py-6 px-6 mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Pour envoyer cette App à tous ceux que vous aimez
          </h3>
          <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-semibold underline text-base"
            >
              Cliquez ici
            </a>
            <span className="text-gray-600">Lien Playstore</span>
            <button className="md:ml-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-colors">
              Mise à jour
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-6 text-center mt-8">
        <p className="mb-2 text-sm md:text-base">mat25v6.msg@gmail.com</p>
        <a
          href="#"
          className="text-orange-400 hover:text-orange-300 underline text-sm md:text-base"
        >
          Politique de confidentialité
        </a>
      </footer>
    </div>
  );
}
