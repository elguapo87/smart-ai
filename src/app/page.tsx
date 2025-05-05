"use client"

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";
import { assets } from "../../assets/assets";

export default function HomePage() {

  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="flex h-screen">

        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#29222d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image onClick={() => setExpand(prev => !prev)} src={assets.menu_icon} alt="" className="rotate-180" />
            <Image src={assets.chat_icon} alt="" className="opacity-70" />
          </div>

          {
            messages.length === 0
                 ?
            (<>
              <div className="flex items-end">
                <Image src={assets.bulb_ai} alt="" className="h-16 w-16 aspect-square invert" />
                <p className="text-2xl font-medium">Hi, I'm Smart AI</p>
              </div>
              <p className="text-sm mt-2">How can I help you today?</p>
            </>)
                 :
            (<div></div>)
          }

          {/* PROMPT BOX */}
          <p className="text-xs absolute bottom-1 text-gray-500">AI generated, for refrence only</p>
        </div>

      </div>
    </div>
  );
}
