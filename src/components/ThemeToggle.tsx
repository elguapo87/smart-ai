"use client"

import Image from "next/image"
import { assets } from "../../assets/assets";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark"

    return (
        <Image onClick={() => setTheme(isDark ? "light" : "dark")} src={isDark ? assets.sun_icon : assets.moon_icon} alt="" className={`w-6 h-6 ${!isDark ? "invert" : ""}`} />
    )
}

export default ThemeToggle
