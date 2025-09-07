interface CategoryProps {
    params: {
        categories: string[];
    };

    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}

export default function Category({params, searchParams}: CategoryProps) {

    const {categories} = params;

    console.log(categories)

    return (
        <>
            <h1>Categoria Dinamica: {categories}</h1>
            <h2>Search Params: {searchParams?.social}</h2>
        </>
    );
}