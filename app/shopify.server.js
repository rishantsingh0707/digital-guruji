import "@shopify/shopify-app-remix/adapters/node";
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { shopifyApp, AppDistribution } from "@shopify/shopify-app-remix/server";

// Initialize Shopify API context
const shopifyContext = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  scopes: process.env.SCOPES?.split(",") || [],
  hostName: process.env.HOST?.replace(/https?:\/\//, ""),
  isEmbeddedApp: true,
  sessionStorage: new SQLiteSessionStorage("./database.sqlite"),
});

// Initialize Shopify App
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(",") || [],
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new SQLiteSessionStorage("./database.sqlite"),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
