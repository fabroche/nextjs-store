import styles from "./Hero.module.sass";

export function Hero() {
    console.log(styles)

    return (
        <section className={styles.Hero}>
            <h1>Future World</h1>
            <h2>Empowering Your Tomorrow, Today!</h2>
        </section>
    );
}
