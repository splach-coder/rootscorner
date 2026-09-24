import type { MetadataRoute } from "next";

/** Home-screen install on Android, and the icon Chrome shows for the site. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Roots Corner",
    short_name: "Roots Corner",
    description: "Pièces rares. Histoires. Matières.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f2",
    theme_color: "#f7f5f2",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/picto.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
