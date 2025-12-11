import {ProductsWrapper} from "@/components/Store/ProductsWrapper";
import {getCollectionProducts, getCollections, getProducts} from "@/services/shopify";


interface CategoryProps {
    params: {
        categories: string[];
    };

    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function Category({params, searchParams}: CategoryProps) {
    const {categories} = await params;

    let products = [];
    const collections = await getCollections();

    if (categories?.length > 0) {
        const selectedCollectionId = collections.find(collection => collection.handle === categories[0])?.id;
        products = await getCollectionProducts(selectedCollectionId);
    } else {
        products = await getProducts();
    }

    return (
        <ProductsWrapper products={products}/>
    );
}