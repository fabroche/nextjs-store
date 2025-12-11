interface ErrorPageProps {
    error: Error;
    reset: () => void;
}

type ProductType = {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
    handle: string;
    tags: string;
};

// Shopify Product Types
interface ShopifyProductVariant {
    id: number;
    product_id: number;
    title: string;
    price: string;
    position: number;
    inventory_policy: string;
    compare_at_price: string | null;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    created_at: string;
    updated_at: string;
    taxable: boolean;
    barcode: string | null;
    fulfillment_service: string;
    grams: number;
    inventory_management: string | null;
    requires_shipping: boolean;
    sku: string | null;
    weight: number;
    weight_unit: string;
    inventory_item_id: number;
    inventory_quantity: number;
    old_inventory_quantity: number;
    admin_graphql_api_id: string;
    image_id: number | null;
}

interface ShopifyProductOption {
    id: number;
    product_id: number;
    name: string;
    position: number;
    values: string[];
}

interface ShopifyProductImage {
    id: number;
    alt: string | null;
    position: number;
    product_id: number;
    created_at: string;
    updated_at: string;
    admin_graphql_api_id: string;
    width: number;
    height: number;
    src: string;
    variant_ids: number[];
}

interface ShopifyProduct {
    id: number;
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    created_at: string;
    handle: string;
    updated_at: string;
    published_at: string;
    template_suffix: string | null;
    published_scope: string;
    tags: string;
    status: string;
    admin_graphql_api_id: string;
    variants: ShopifyProductVariant[];
    options: ShopifyProductOption[];
    images: ShopifyProductImage[];
    image: ShopifyProductImage | null;
}