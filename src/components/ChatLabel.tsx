"use client"

import Image from "next/image";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useTheme } from "next-themes";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

type SidebarProps = {
    id: number;
    name: string;
    openMenu: {
        id: number;
        open: boolean;
    };
    setOpenMenu: Dispatch<SetStateAction<{
        id: number;
        open: boolean;
    }>>;
};

const ChatLabel = ({ openMenu, setOpenMenu, id, name }: SidebarProps) => {

    const context = useContext(AppContext);
    if (!context) throw new Error("ChatLabel must be within AppContextProvider");
    const { fetchUsersChats, chats, setSelectedChat } = context;

    const selectChat = () => {
        const chatData = chats.find((chat) => chat._id === id);
        setSelectedChat(chatData ?? null)
    };

    const renameHandler = async () => {
        try {
            const newName = prompt("Enter new name");
            if (!newName) return;

            const { data } = await axios.post("/api/chat/rename", { chatId: id, name: newName });
            if (data.success) {
                await fetchUsersChats();
                setOpenMenu({ id: 0, open: false });
                toast.success(data.message);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    const deleteHandler = async () => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this chat?");
            if (!confirm) return;

            const { data } = await axios.post("/api/chat/delete", { chatId: id });
            if (data.success) {
                await fetchUsersChats();
                setOpenMenu({ id: 0, open: false });
                toast.success(data.message);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <div onClick={selectChat} className="flex items-center justify-between p-2 text-gray-800 dark:text-white/80 hover:bg-gray-500/30 dark:hover:bg-white/10 rounded-lg text-sm group cursor-pointer">
            <p className="group-hover:max-w-5/6 truncate">{name}</p>

            <div onClick={(e) => { e.stopPropagation(); setOpenMenu({ id: id, open: !openMenu.open }) }} className="group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-gray-500/30 dark:hover:bg-black/80 rounded-lg">
                <Image src={assets.three_dots} alt="" className={`w-4 ${openMenu.id === id && openMenu.open ? "" : "hidden"} ${!isDark && "invert"} group-hover:block`} />
                <div className={`absolute ${openMenu.id === id && openMenu.open ? "block" : "hidden"} -right-36 top-6 dark:text-stone-200 bg-gray-600/30 dark:bg-gray-700 rounded-xl w-max p-2`}>
                    <div onClick={renameHandler} className="flex items-center gap-3 hover:bg-gray-400/30 dark:hover:bg-white/10 px-3 py-2 rounded-lg">
                        <Image src={assets.pencil_icon} alt="" className={`w-4 ${!isDark && "invert"}`} />
                        <p>Rename</p>
                    </div>

                    <div onClick={deleteHandler} className="flex items-center gap-3 hover:bg-gray-400/30 dark:hover:bg-white/10 px-3 py-2 rounded-lg">
                        <Image src={assets.delete_icon} alt="" className="w-4" />
                        <p>Delete</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatLabel
