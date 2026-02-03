import {HTMLAttributes, createElement} from "react";
import sanitize from "sanitize-html";

type SanitizeHTMLProps = {
    children: string;
    tag: string;
} & HTMLAttributes<HTMLElement>;

export function SanitizeHTML({children, tag, ...rest}: SanitizeHTMLProps) {

    const sanitizedHTML = sanitize(children, {
        allowedTags: [''],
    });

    return createElement(
        tag,
        {...rest},
        sanitizedHTML
    )
}