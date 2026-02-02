import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Music,
} from "lucide-react";

export const SocialNetworks = () => {
  return (
    <div className="flex items-center gap-4">

                    {/* TikTok (Music icon) */}
                    <a
                        href="https://www.tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform duration-200 text-dark"
                    >
                        <Music size={24} />
                    </a>

                    {/* X (Twitter) */}
                    <a
                        href="https://x.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform duration-200 text-dark"
                    >
                        <Twitter size={24} />
                    </a>

                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform duration-200 text-dark"
                    >
                        <Instagram size={24} />
                    </a>

                    {/* Facebook */}
                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform duration-200 text-dark"
                    >
                        <Facebook size={24} />
                    </a>

                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform duration-200 text-dark"
                    >
                        <Linkedin size={24} />
                    </a>
            </div>
  )
}
