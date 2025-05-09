import Image from "next/image";
import { assets } from "../../assets/assets";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Prism from "prismjs"
import Markdown from "react-markdown";
import toast from "react-hot-toast";

type HomePageProps = {
  role: string;
  content: string;
};

const Message = ({ role, content }: HomePageProps) => {

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
                      <Image src={assets.like_icon} alt="" className={`w-4 cursor-pointer ${!isDark && "invert"}`} />
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
