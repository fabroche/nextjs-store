import {shopifyUrls} from "@/services/shopify/urls";
import {env} from "@/config/env";

export async function getCollections() {
    try {
        const options = {
            headers: new Headers({
                'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
            }),
        }

        const response = await fetch(
            shopifyUrls.collections.all,
            options
        )

        // throw new Error('error lalalala')
        const {smart_collections} = await response.json()


        return smart_collections.map(collection => {
            return {
                id: collection.id,
                title: collection.title,
                handle: collection.handle
            }
        });

    } catch (error) {
        console.log(error)
    }
}

export async function getCollectionProducts(id: string) {
    try {
        const response = await fetch(
            shopifyUrls.collections.products(id),
            {
                headers: new Headers({
                    'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
                }),
            }
        );

        const {products} = await response.json();

        return products

    } catch (error) {
        console.log(error)
    }
}