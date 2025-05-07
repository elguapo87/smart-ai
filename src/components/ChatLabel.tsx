"use client"

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useTheme } from "next-themes";

type SidebarProps = {
    openMenu: {
        id: number;
        open: boolean;
    };
    setOpenMenu: Dispatch<SetStateAction<{
        id: number;
        open: boolean;
    }>>;
};

const ChatLabel = ({ openMenu, setOpenMenu }: SidebarProps) => {

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <div className="flex items-center justify-between p-2 text-gray-800 dark:text-white/80 hover:bg-gray-500/30 dark:hover:bg-white/10 rounded-lg text-sm group cursor-pointer">
            <p className="group-hover:max-w-5/6 truncate">Chat Name Here</p>

            <div className="group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-gray-500/30 dark:hover:bg-black/80 rounded-lg">
                <Image src={assets.three_dots} alt="" className={`w-4 ${openMenu.open ? "" : "hidden"} ${!isDark && "invert"} group-hover:block`} />
                <div className={`absolute ${openMenu.open ? "block" : "hidden"} -right-36 top-6 dark:text-stone-200 bg-gray-600/30 dark:bg-gray-700 rounded-xl w-max p-2`}>
                    <div className="flex items-center gap-3 hover:bg-gray-400/30 dark:hover:bg-white/10 px-3 py-2 rounded-lg">
                        <Image src={assets.pencil_icon} alt="" className={`w-4 ${!isDark && "invert"}`} />
                        <p>Rename</p>
                    </div>

                    <div className="flex items-center gap-3 hover:bg-gray-400/30 dark:hover:bg-white/10 px-3 py-2 rounded-lg">
                        <Image src={assets.delete_icon} alt="" className="w-4" />
                        <p>Delete</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatLabel
