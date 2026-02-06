"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const GlowCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener("resize", handleResize);

        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const springConfig = { damping: 25, stiffness: 150 };
    const cursorX = useSpring(mousePosition.x, springConfig);
    const cursorY = useSpring(mousePosition.y, springConfig);

    if (isMobile) return null;

    return (
        <>
            <motion.div
                aria-hidden="true"
                className="fixed top-0 left-0 w-8 h-8 bg-violet-500/30 rounded-full blur-xl pointer-events-none z-[9999]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />
            <motion.div
                aria-hidden="true"
                className="fixed top-0 left-0 w-2 h-2 bg-pink-500 rounded-full pointer-events-none z-[9999]"
                style={{
                    x: mousePosition.x,
                    y: mousePosition.y,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />
        </>
    );
};

export default GlowCursor;
