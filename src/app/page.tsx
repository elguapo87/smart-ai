"use client"

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import { AppContext } from "@/context/AppContext";

type MessageType = {
  _id?: number;
  role: string;
  content: string;
  timestamp: number;
};

export default function HomePage() {

  const context = useContext(AppContext);
  if (!context) throw new Error("HomePage must be within AppContextProvider");
  const { selectedChat } = context;

  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages]);


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
            (<div ref={containerRef} className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto">
              <p className="fixed top-8 border border-transparent hover:border-gray-500/50 px-2 py-1 rounded-lg font-semibold mb-6">
                {selectedChat?.name}
              </p>

              {messages.map((msg, index) => (
                <Message key={`${msg._id}-${index}`} role={msg.role} content={msg.content} />
              ))}

              {isLoading && (
                <div className="flex gap-2.5 max-w-3xl w-full py-3">
                  <Image src={assets.bulb_ai} alt="Logo" className={`h-9 w-9 p-1 border rounded-full ${isDark ? "border-black/15 invert" : "border-gray-600/50"}`} />
                  <div className="loader flex justify-center items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-gray-600 dark:bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-600 dark:bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-600 dark:bg-white animate-bounce"></div>
                  </div>
                </div>
              )}

            </div>)
          }

          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          <p className="text-xs absolute bottom-1 text-gray-500">AI generated, for refrence only</p>
        </div>

      </div>
    </div>
  );
}
