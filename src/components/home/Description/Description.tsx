"use client";
import Image from "next/image";
import styles from "./Description.module.sass";
import {PLACEHOLDER_IMAGE_URL} from "@/assets/blurDataURLs";
import {useState} from "react";
import classNames from "classnames/bind";


export function Description() {
    const [hasBorder, setHasBorder] = useState(false)

    function handleClick() {
        setHasBorder(!hasBorder);
    }

    const cx = classNames.bind(styles);

    const buttonStyles = cx('Description__button', {
        'Description__button--border': hasBorder,
    })

    // console.log(hasBorder)
    // console.log(buttonStyles)

    return (
        <section className={styles.Description}>
            <button
            onClick={handleClick}
            className={buttonStyles}
            >

                <div className={styles.Description__imageContainer}>
                    <Image
                        src={"/images/description.jpeg"}
                        alt={"Imagen de ejemplo"}
                        fill
                        placeholder="blur"
                        blurDataURL={PLACEHOLDER_IMAGE_URL}
                    />
                </div>
            </button>
            <div className={styles.Description__text}>

                <h2 className={styles.Description__text}>Bring the future today</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci aliquid amet beatae cum
                    cupiditate
                    delectus doloremque earum enim illum in incidunt iste magni nisi pariatur quis recusandae, similique
                    vel!</p>
            </div>
        </section>
    );
}