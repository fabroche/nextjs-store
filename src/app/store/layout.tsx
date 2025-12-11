import {getCollections} from "@/services/shopify";
import Link from "next/link";
import styles from '@/app/store/StoreLayout.module.sass'

export default async function CategoryLayout({
                                                 children,
                                             }: Readonly<{
    children: React.ReactNode;
}>) {

    const collections = await getCollections();

    return (
        <main className={styles.StoreLayout}>
            <h1>Explore</h1>
            <nav>
                <ul className={styles.StoreLayout__list}>
                    {
                        collections.map((collection) => (
                            <Link key={collection.id} href={'/store/' + collection.handle} className={styles.StoreLayout__chip}>
                                {collection.title}
                            </Link>
                        ))
                    }
                </ul>
            </nav>
            {children}
        </main>
    );
}