import Image from "next/image";
import { assets } from "../../assets/assets";
import { useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Prism from "prismjs"
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

type HomePageProps = {
  role: string;
  content: string;
  messageId?: string | number;
};

const Message = ({ role, content, messageId }: HomePageProps) => {

  const context = useContext(AppContext);
  if (!context) throw new Error("Message must be within AppContextProvider");
  const { selectedChat, user, fetchUsersChats } = context;

  const likeHandler = async () => {
    try {
      const { data } = await axios.post("/api/chat/like", { chatId: selectedChat?._id, messageId: messageId });
      if (data.success) {
        toast.success(data.message);
        await fetchUsersChats();

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occured";
      toast.error(errMessage);      
    }
  };

  console.log(selectedChat);
  

  const userId = user?.id;

  const message = selectedChat?.messages.find((msg) => msg._id === messageId);
  
  const isLikedByUser = message && userId ? (message.likes ?? []).includes(userId) : false;

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const copyMessage = () => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      <div className={`flex flex-col w-full mb-8 ${role === "user" && "items-end"}`}>
        <div className={`group relative flex items-center max-w-2xl py-3 rounded-xl ${role === "user" ? "bg-[#414158] px-5" : "gap-3"}`}>
          <div className={`opacity-0 group-hover:opacity-100 absolute ${role === "user" ? "-left-6 top-2.5" : "left-9 -bottom-6"} transition-all`}>
            <div className="flex items-center gap-2 opacity-70">
              {
                role === "user"
                  ?
                  (
                    <>
                      <Image onClick={copyMessage} src={assets.copy_icon} alt="" className={`w-4 cursor-pointer ${!isDark && "invert"}`} />
                    </>
                  )
                  :
                  (
                    <>
                      <Image onClick={copyMessage} src={assets.copy_icon} alt="" className={`w-4.5 cursor-pointer ${!isDark && "invert"}`} />
                      <button disabled={isLikedByUser}><Image onClick={likeHandler} src={isLikedByUser ? assets.like_reverse : assets.like_icon} alt="" className={`w-4 cursor-pointer ${!isDark && "invert"}`} /></button>
                      <Image src={assets.dislike_icon} alt="" className={`w-4 cursor-pointer ${!isDark && "invert"}`} />
                    </>
                  )
              }
            </div>
          </div>

          {
            role === "user"
              ?
              (
                <span className="text-white/90">{content}</span>
              )
              :
              (
                <>
                  <Image src={assets.bulb_ai} alt="" className={`h-9 w-9 aspect-square p-1 border rounded-full ${isDark ? "border-black/15 invert" : "border-gray-600/50"}`} />
                  <div className="space-y-4 w-full overflow-scroll">
                    <Markdown>
                      {content}
                    </Markdown>
                  </div>
                </>
              )
          }

        </div>
      </div>
    </div>
  )
}

export default Message
