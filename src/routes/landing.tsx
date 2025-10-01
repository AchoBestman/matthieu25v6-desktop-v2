// routes/_landing/landing.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookAudio } from "lucide-react";
import tauriConfig from "../../src-tauri/tauri.conf.json";
import { tr } from "@/translation";
import { open as OpenTauri } from "@tauri-apps/plugin-shell";

export const Route = createFileRoute("/landing")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const languages = [
    { code: "fr", flag: "🇫🇷", name: "Français", url: "/fr" },
    { code: "en", flag: "🇬🇧", name: "English", url: "/en" },
    { code: "es", flag: "🇪🇸", name: "Español", url: "/es" },
    { code: "pt", flag: "🇵🇹", name: "Português", url: "/pt" },
    // { code: "sw", flag: "🇰🇪", name: "Swahili", url: "/sw" },
    // { code: "multi", flag: "🌍", name: "Multi-langues", url: "/multi" },
    { code: "zh", flag: "🇨🇳", name: "中文", url: "/zh" },
    { code: "hi", flag: "🇮🇳", name: "हिन्दी", url: "/hi" },
    { code: "ar", flag: "🇸🇦", name: "العربية", url: "/ar" },
    { code: "fa", flag: "🇮🇷", name: "فارسی", url: "/fa" },
  ];

  return (
    <div className="min-h-screen max-h-screen relative w-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-[5vh] bg-amber-800 text-white py-2 px-6 flex items-center justify-between shadow-lg">
        <h1 className="text-xl font-semibold">
          {tr("home.title")} v{tauriConfig.version}
        </h1>
        <div className="flex">
          <button
            onClick={async () =>
              await OpenTauri("https://www.iubenda.com/privacy-policy/84576984")
            }
            className="cursor-pointer text-orange-400s hover:text-orange-300 underlines text-sm md:text-base px-2"
          >
            {tr("home.confidentiality_clause")} 
          </button>
          <Link
            to="/sermons"
            className="flex items-center gap-2 px-4 py-1 text-white rounded-lg border-1 hover:bg-amber-700 transition-colors shadow-md"
          >
            <BookAudio size={20} />
            {tr("home.sermon")}
          </Link>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="h-[87vh] flex flex-col">
        {/* Language Selection */}
        <div className="bg-gray-100 py-3 px-4">
          <p className="text-center text-blue-900 font-semibold text-base mb-3">
            {tr("home.choose_langue")} 
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => (window.location.href = lang.url)}
                className="flex flex-col items-center justify-center p-2 bg-white rounded shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-300"
                title={lang.name}
                style={{ width: "70px", height: "70px" }}
              >
                <span className="text-3xl">{lang.flag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Banner Image with Content */}
        <div
          style={{
            backgroundImage: `url('/images/1080X564.png')`,
          }}
          className="flex-1 bg-cover bg-center bg-no-repeat flex flex-col"
        > 
          <div className="text-center py-4 px-4">
              <h2 className="text-yellow-200 text-2xl md:text-3xl font-bold">
                {tr("home.first_image_title")} 
              </h2>
              <h3 className="text-white text-xl md:text-2xl font-semibold uppercase tracking-wider mt-1">
               {tr("home.second_image_title")} 
              </h3>
              <p className="text-amber-500 text-lg md:text-xl font-bold mt-1">
                {tr("home.third_image_title")} 
              </p>
            </div>
          {/* Bible Verse Quote */}
          <div className="mt-auto mb-13 mx-4">
            <div className="bg-white/95s rounded-lg shadow-lg p-4">
              <p className="text-blue-900 text-xl leading-relaxed italic text-center font-medium">
                "{tr("home.image_message")}"
              </p>
              <p className="text-right text-blue-800 font-bold -mt-2 text-sm">
                1Cor 2:4, 1Cor 4:20
              </p>
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-4 mx-4">
            <div className="bg-white/95s rounded-lg shadow-lg py-4 px-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                {tr("home.share_message")}
              </h3>
              <div className="flex items-center justify-between gap-3">
                <a
                  href="#"
                  className="text-red-800 hover:text-blue-800 font-semibold underline text-sm"
                >
                  {tr("home.share_button_title")}
                </a>
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow-lg transition-colors text-sm">
                  {tr("home.update_button_message")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-2 text-center h-[8vh] flex flex-col justify-center">
        <p className="mb-1 text-sm">mat25v6.msg@gmail.com</p>
        <button
          onClick={async () =>
            await OpenTauri("https://www.iubenda.com/privacy-policy/84576984")
          }
          className="cursor-pointer text-orange-400 hover:text-orange-300 underline text-xs"
        >
          {tr("home.confidentiality_clause")}
        </button>
      </footer>
    </div>
  );
}