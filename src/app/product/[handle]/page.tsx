import {useParams, useSearchParams} from "next/navigation";
import {ProductView} from "@/components/product/ProductView";
import {getProducts} from "@/services/shopify";

interface ProductPageProps {
    searchParams: {
        id: string;
    };
}

export default async function ProductPage({searchParams}: ProductPageProps) {

    const {id} = await searchParams;
    console.log('id', id)

    const products = await getProducts(id);

    console.log('products', products)

    return <ProductView product={products[0]}/>
}