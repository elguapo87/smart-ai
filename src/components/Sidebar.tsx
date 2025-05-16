"use client"

import Image from "next/image"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "@/context/AppContext";
import ChatLabel from "./ChatLabel";
import { useTheme } from "next-themes";

type HomePageType = {
  expand: boolean;
  setExpand: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ expand, setExpand }: HomePageType) => {

  const context = useContext(AppContext);
  if (!context) throw new Error("Sidebar must be within AppContextProvider");
  const { token, setToken, createNewChat, chats, setUserLogin, userData, setUserData } = context;

  const [openMenu, setOpenMenu] = useState<{
    id: string;
    open: boolean;
  }>({
    id: "",
    open: false
  });


  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
  }

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className={`flex flex-col justify-between bg-[#c5c5c5] dark:bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${expand ? "p-4 w-64" : "md:w-20 w-0 max-md:overflow-hidden"}`}>
      <div>
        <div className={`flex ${expand ? "flex-row gap-10" : "flex-col items-center gap-8"}`}>
          <Image src={expand ? assets.smart_ai : assets.bulb_ai} alt="" className={expand ? "w-36 dark:invert" : "w-10 dark:invert"} />

          <div onClick={() => setExpand(prev => !prev)} className="group relative flex items-center justify-center hover:bg-gray-500/40 dark:hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer">
            <Image src={assets.menu_icon} alt="" className={`md:hidden ${!isDark && "invert"}`} />
            <Image src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} alt="" className={`hidden md:block w-7 ${!isDark && "invert"}`} />

            <div className={`absolute w-max ${expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"} opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}>
              {expand ? "Close sidebar" : "Open sidebar"}
              <div className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`}></div>
            </div>
          </div>
        </div>

        <button onClick={createNewChat} className={`mt-8 flex items-center justify-center cursor-pointer ${expand ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max" : "group relative h-9 w-9 mx-auto hover:bg-gray-500/40 dark:hover:bg-gray-500/30 rounded-lg"}`}>
          <Image src={expand ? assets.chat_icon : assets.chat_icon_dull} alt="" className={`${expand ? "w-6" : "w-7"} ${!expand && !isDark && "invert"}`} />
          <div className="absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none">
            New chat
            <div className="w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5"></div>
          </div>

          {expand && <p className="text-white text font-medium">New chat</p>}
        </button>

        <div className={`mt-8 text-white/25 text-sm ${expand ? "block" : "hidden"}`}>
          <p className="my-1 text-gray-800 dark:text-gray-400">Recents</p>

          {chats.map((chat) => (
            chat._id && (<ChatLabel key={chat._id} openMenu={openMenu} setOpenMenu={setOpenMenu} name={chat.name} id={chat._id} />)
          ))}
        </div>
      </div>

      <div className={`flex items-center ${!expand && "justify-center w-full mb-5"} text-sm p-2 mt-2`}>
        {
          token 
            ?
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <Image src={assets.profile_icon} alt="Profile" className={`w-7 h-7 aspect-square rounded-full ${!isDark && "invert"}`} />
              {expand && userData?.name}
            </div>
            {expand && <button onClick={logoutHandler} className={`border-none text-sm font-semibold px-1.5 py-0.5 ${isDark ? "bg-stone-200 text-gray-800 hover:bg-stone-400 hover:text-black" : "bg-gray-800 text-stone-200 hover:bg-black hover:text-stone-50"} rounded transition-all duration-300 cursor-pointer`}>Logout</button>}
          </div>
            :
          <button onClick={() => setUserLogin(true)} className={`border-none px-2.5 py-1 rounded bg-primary text-white hover:bg-purple-800 transition-all duration-300 cursor-pointer`}>Login</button>
        }
      </div>


    </div>
  )
}

export default Sidebar