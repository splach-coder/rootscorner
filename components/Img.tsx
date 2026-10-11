"use client";

import NextImage, { type ImageProps } from "next/image";
import { SHOPIFY_CDN, shopifyLoader } from "@/lib/image-loader";

/**
 * next/image, with Shopify photographs resized by Shopify (lib/image-loader.ts)
 * and the site's own by the default loader. A drop-in replacement: use it
 * wherever a photograph may come from Shopify.
 */
export default function Img(props: ImageProps) {
  const fromShopify = typeof props.src === "string" && props.src.startsWith(SHOPIFY_CDN);
  return <NextImage {...props} loader={fromShopify ? shopifyLoader : props.loader} />;
}
