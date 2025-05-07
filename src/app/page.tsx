"use client"

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "next-themes";

export default function HomePage() {

  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div>
      <div className="flex h-screen">

        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 dark:text-white relative">
          <div className="absolute px-4 top-6 flex items-center justify-between w-full cursor-pointer">
            <Image onClick={() => setExpand(prev => !prev)} src={assets.menu_icon} alt="" className={`md:hidden rotate-180 ${!isDark && "invert"}`} />
            <div className="flex items-center gap-3">
              <Image src={assets.chat_icon} alt="" className={`md:hidden opacity-70 ${!isDark && "invert"}`} />
              <ThemeToggle />
            </div>
          </div>

          {
            messages.length === 0
                 ?
            (<>
              <div className="flex items-end">
                <Image src={assets.bulb_ai} alt="" className={`h-16 w-16 aspect-square ${isDark ? "invert" : ""}`} />
                <p className="text-2xl font-medium">Hi, I&apos;m Smart AI</p>
              </div>
              <p className="text-sm mt-2">How can I help you today?</p>
            </>)
                 :
            (<div>
              <Message role="ai" content="What is meaning of life?" />
            </div>)
          }

          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          <p className="text-xs absolute bottom-1 text-gray-500">AI generated, for refrence only</p>
        </div>

      </div>
    </div>
  );
}
