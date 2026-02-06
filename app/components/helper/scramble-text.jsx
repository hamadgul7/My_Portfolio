"use client";

import { useEffect, useState, useCallback } from "react";

const CHARS = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

const ScrambleText = ({ text, className, delay = 0 }) => {
    const [displayText, setDisplayText] = useState("");
    const [isScrambling, setIsScrambling] = useState(false);

    const scramble = useCallback(async () => {
        setIsScrambling(true);
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText((prev) =>
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
                setIsScrambling(false);
            }

            iteration += 1 / 3;
        }, 30);
    }, [text]);

    useEffect(() => {
        const timer = setTimeout(() => {
            scramble();
        }, delay);
        return () => clearTimeout(timer);
    }, [scramble, delay]);

    return (
        <span className="inline-grid">
            <span className="invisible pointer-events-none select-none [grid-area:1/1]" aria-hidden="true">
                {text}
            </span>
            <span className={`${className} [grid-area:1/1]`} aria-label={text}>
                {displayText || text.split("").map(() => " ").join("")}
            </span>
        </span>
    );
};


export default ScrambleText;
