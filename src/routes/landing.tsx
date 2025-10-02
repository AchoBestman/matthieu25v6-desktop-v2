// routes/_landing/landing.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookAudio } from "lucide-react";
import tauriConfig from "../../src-tauri/tauri.conf.json";
import { tr } from "@/translation";
import { open as OpenTauri } from "@tauri-apps/plugin-shell";
import { LangueDataType } from "@/components/commons/langue-dropdown";
import { useLangue } from "@/context/langue-context";
import { useSermon } from "@/context/sermon-context";

export const Route = createFileRoute("/landing")({
  component: RouteComponent,
});

export const languages: Array<LangueDataType> = [
  {
    id: 1,
    name: "English",
    lang: "en-en",
    countryFip: "en",
    icon: `/images/drapeau/en.jpg`,
    translation: "en",
    exist: true,
  },
  {
    id: 2,
    name: "Français",
    lang: "fr-fr",
    countryFip: "fr",
    icon: `/images/drapeau/fr.jpg`,
    translation: "fr",
    exist: true,
  },
  {
    id: 3,
    name: "Español",
    lang: "es-es",
    countryFip: "es",
    icon: `/images/drapeau/es.jpg`,
    translation: "es",
    exist: true,
  },
  {
    id: 4,
    name: "Português",
    lang: "pt-pt",
    countryFip: "pt",
    icon: `/images/drapeau/pt.jpg`,
    translation: "pt",
    exist: true,
  },
  {
    id: 6,
    name: "中文",
    lang: "cn-zh",
    countryFip: "cn",
    icon: `/images/drapeau/cn.jpg`,
    translation: "zh",
    exist: true,
  },
  {
    id: 7,
    name: "हिन्दी",
    lang: "in-hi",
    countryFip: "cn",
    icon: `/images/drapeau/in.jpg`,
    translation: "hi",
    exist: true,
  },
  {
    id: 8,
    name: "العربية",
    lang: "sa-ar",
    countryFip: "sa",
    icon: `/images/drapeau/sa.jpg`,
    translation: "ar",
    exist: true,
  },
  {
    id: 9,
    name: "فارسی",
    lang: "ir-fa",
    countryFip: "ir",
    icon: `/images/drapeau/ir.jpg`,
    translation: "fa",
    exist: true,
  },
];

export default function RouteComponent() {
  const { setDefaultLangue } = useLangue();
  const { setVerseNumber, setNumber } = useSermon();
  const navigate = useNavigate();

  const changeUrl = (langue: LangueDataType) => {
    setDefaultLangue(langue);
    setNumber("1");
    setVerseNumber("");
  };

  const openLink = async (url: string) => {
    try {
      await OpenTauri(url);
    } catch (error) {
      console.error("Erreur lors de l'ouverture du lien:", error);
      // Fallback : ouvrir dans le navigateur classique
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen max-h-screen relative w-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-[5vh] bg-amber-800 text-white py-2 px-6 flex items-center justify-between shadow-lg">
        <h1 className="text-xl font-semibold">
          {tr("home.title")} v{tauriConfig.version}
        </h1>
        <div className="flex">
          <button
            onClick={() =>
              openLink("https://www.iubenda.com/privacy-policy/84576984")
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
        <div className="bg-white py-3 px-4">
          <p className="text-center text-blue-900 font-semibold text-base mb-3">
            {tr("home.choose_langue")}
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {languages.map((item) => (
              <button
                onClick={() => {
                  changeUrl(item);
                  navigate({ to: "/sermons" });
                }}
                key={item.id}
                className="flex flex-col items-center justify-center p-2 border border-amber-800 rounded shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer "
                title={item.name}
                style={{ maxWidth: "100px", maxHeight: "70px" }}
              >
                <div className="flex-col items-center justify-center">
                  <img
                    alt={item.lang}
                    src={item.icon}
                    style={{ maxWidth: "70px" }}
                  />
                </div>
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
          <div className="text-center py-4 px-4 mt-5">
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
          <div className="mt-auto mb-20 mx-4 w-full flex justify-center">
            <div className="bg-white/95 p-2 max-w-4xl">
              <p className="text-blue-900 text-2xl leading-relaxed italic text-center font-medium">
                {`"${tr("home.image_message")}"`}
              </p>
              <p className="text-right text-blue-800 font-bold mt-2 text-md ">
                1Cor 2:4, 1Cor 4:20
              </p>
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-4 mx-4">
            <div className="bg-white/95s rounded-lg shadow-lg py-4 px-4">
              <span className="text-md font-semibold text-red-500 mb-3 px-4 py-2 bg-white">
                {tr("home.share_message")}
              </span>
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() =>
                    openLink(
                      "https://web.crabnebula.cloud/prophet-kacou/prophet-kacou/releases"
                    )
                  }
                  className="px-4 py-2 bg-white hover:bg-green-600 text-indigo-900 hover:text-white font-semibold rounded shadow-lg transition-colors text-sm cursor-pointer border border-white"
                >
                  {tr("home.share_button_title")}
                </button>
                {/* <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow-lg transition-colors text-sm">
                  {tr("home.update_button_message")}
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer  */}
      <footer className="bg-indigo-900 text-white py-2 text-center h-[8vh] flex flex-col justify-center">
        <p className="mb-1 text-sm">mat25v6.msg@gmail.com</p>
        <button
          onClick={() =>
            openLink("https://www.iubenda.com/privacy-policy/84576984")
          }
          className="cursor-pointer text-orange-400 hover:text-orange-300 underline text-xs"
        >
          {tr("home.confidentiality_clause")}
        </button>
      </footer>
    </div>
  );
}
