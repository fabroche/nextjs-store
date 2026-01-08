import {env} from "@/config/env";

export const shopifyUrls = {
    products: {
        all: `${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/products.json`,
        mainProducts: `${env.SHOPIFY_HOSTNAME}/admin/api/2023-10/collections/672049463622/products.json`,
        create: `${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/products.json`,
        update: `${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/products/:id.json`,
        delete: `${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/products/:id.json`
    },

    collections: {
        all: `${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/smart_collections.json`,
        create: `${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/smart_collections.json`,
        update: `${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/smart_collections/:id.json`,
        delete: `${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/smart_collections/:id.json`,
        products: (id: string) =>`${env.SHOPIFY_HOSTNAME}/admin/api/2025-10/collections/${id}/products.json`
    }
}