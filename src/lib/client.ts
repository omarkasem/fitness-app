import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";


export const config = {
  projectId: "8fv9krpb",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
}

export const client = createClient(config)

// Admin level client
const adminConfig = {
  ...config,
  token: process.env.SANITY_API_TOKEN,
}

export const adminClient = createClient(adminConfig)

// Image url builder
const builder = imageUrlBuilder(client)

export const urlFor = (source: string) => builder.image(source)