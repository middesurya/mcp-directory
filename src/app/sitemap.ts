import { MetadataRoute } from "next";
import { getAllServers, getAllCategories } from "@/lib/queries";
import { getAllClients } from "@/data/clients";

const BASE_URL = "https://mcp-directory-pi.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const servers = getAllServers();
  const categories = getAllCategories();
  const clients = getAllClients();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/servers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/clients`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Server pages
  const serverPages: MetadataRoute.Sitemap = servers.map((server) => ({
    url: `${BASE_URL}/server/${server.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/category/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Client pages
  const clientPages: MetadataRoute.Sitemap = clients.map((client) => ({
    url: `${BASE_URL}/clients/${client.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...serverPages, ...categoryPages, ...clientPages];
}
