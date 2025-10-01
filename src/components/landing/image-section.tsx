import { Facebook, Youtube } from "lucide-react";

export default function ImageSection() {
  return (
    <div style={{
        backgroundImage: `url('/images/1080X564.png')`,
      }}className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden mb-6">
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
  )
}
