import {shopifyUrls} from "@/services/shopify/urls";
import {env} from "@/config/env";

export async function getProducts(id?: string): Promise<ProductType[]> {
    try {
        const options = {
            headers: new Headers({
                'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
            }),
        }

        const apiUrl = id ? `${shopifyUrls.products.all}?ids=${id}` : shopifyUrls.products.all

        const response = await fetch(
            apiUrl,
            options
        )

        // throw new Error('error lalalala')
        const {products} = await response.json()

        const mappedProducts = products.map((product: ShopifyProduct) => {
            return {
                id: product.id,
                gql_id: product.variants[0].admin_graphql_api_id,
                title: product.title,
                description: product.body_html,
                price: product.variants[0].price,
                image: product.images[0].src,
                quantity: product.variants[0].inventory_quantity,
                handle: product.handle,
                tags: product.tags
            }
        })

        return mappedProducts;
    } catch (error) {
        console.log(error)
    }
}

export const getMainProducts = async () => {
    const response = await fetch(shopifyUrls.products.mainProducts, {
        headers: new Headers({
            'X-Shopify-Access-Token': env.SHOPIFY_API_KEY
        }),
        cache: 'no-cache',
        next: {
         tags: ['main-products']
        }
    })

    const {products} = await response.json()

    console.log(products)

    return products
}