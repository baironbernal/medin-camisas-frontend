import { Facebook, Instagram, Music } from "lucide-react";
import { getSiteInfo } from "@/app/services/siteInfo";

export default async function SocialNetworks() {
  const info = await getSiteInfo();

  const networks = [
    { url: info.social_instagram_url, label: info.social_instagram_handle, Icon: Instagram },
    { url: info.social_facebook_url, label: info.social_facebook_handle, Icon: Facebook },
    { url: info.social_tiktok_url, label: info.social_tiktok_handle, Icon: Music },
  ].filter((n) => n.url);

  return (
    <div className="flex items-center gap-4">
      {networks.map(({ url, label, Icon }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="hover:scale-110 transition-transform duration-200 text-dark"
        >
          <Icon size={24} />
        </a>
      ))}
    </div>
  );
}
