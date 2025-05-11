import Image from "next/image";
import { assets } from "../../assets/assets";
import { useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Prism from "prismjs";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

type MessageProps = {
  message: {
    _id?: string;
    role: string;
    content: string;
    timestamp: number;
    likes?: string[];
    dislikes?: string[];
  };
};

const Message = ({ message }: MessageProps) => {
  const { _id: messageId, role, content, likes = [], dislikes = [] } = message;

  const context = useContext(AppContext);
  if (!context) throw new Error("Message must be within AppContextProvider");

  const { selectedChat, user, fetchUsersChats } = context;

  const userId = user?.id;

  const isLikedByUser = userId ? likes.includes(userId) : false;
  const isDislikedByUser = userId ? dislikes.includes(userId) : false;

  const likeHandler = async () => {
    try {
      const { data } = await axios.post("/api/chat/like", {
        chatId: selectedChat?._id,
        messageId,
      });

      if (data.success) {
        await fetchUsersChats();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  const dislikeHandler = async () => {
    try {
      const { data } = await axios.post("/api/chat/dislike", {
        chatId: selectedChat?._id,
        messageId,
      });

      if (data.success) {
        await fetchUsersChats();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      <div
        className={`flex flex-col w-full mb-8 ${
          role === "user" && "items-end"
        }`}
      >
        <div
          className={`group relative flex items-center max-w-2xl py-3 rounded-xl ${
            role === "user" ? "bg-[#414158] px-5" : "gap-3"
          }`}
        >
          <div
            className={`opacity-0 group-hover:opacity-100 absolute ${
              role === "user" ? "-left-6 top-2.5" : "left-9 -bottom-6"
            } transition-all`}
          >
            <div className="flex items-center gap-2 opacity-70">
              <Image
                onClick={copyMessage}
                src={assets.copy_icon}
                alt=""
                className={`w-4 cursor-pointer ${!isDark && "invert"}`}
              />
              {role !== "user" && (
                <>
                  <button onClick={likeHandler} disabled={isLikedByUser}>
                    <Image
                      src={
                        isLikedByUser
                          ? assets.like_reverse
                          : assets.like_icon
                      }
                      alt=""
                      className={`w-4 cursor-pointer ${!isDark && "invert"} ${
                        isLikedByUser && "scale-150"
                      }`}
                    />
                  </button>
                  <button onClick={dislikeHandler} disabled={isDislikedByUser}>
                    <Image
                      src={
                        isDislikedByUser
                          ? assets.dislike_reverse
                          : assets.dislike_icon
                      }
                      alt=""
                      className={`w-4 cursor-pointer ${!isDark && "invert"} ${
                        isDislikedByUser && "scale-150"
                      }`}
                    />
                  </button>
                </>
              )}
            </div>
          </div>

          {role === "user" ? (
            <span className="text-white/90">{content}</span>
          ) : (
            <>
              <Image
                src={assets.bulb_ai}
                alt=""
                className={`h-9 w-9 aspect-square p-1 border rounded-full ${
                  isDark ? "border-black/15 invert" : "border-gray-600/50"
                }`}
              />
              <div className="space-y-4 w-full overflow-scroll">
                <Markdown>{content}</Markdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
