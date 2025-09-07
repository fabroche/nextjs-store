export default function CategoryLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <nav>Navegacion de las categorias</nav>
            {children}
        </main>
    );
}