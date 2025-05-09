"use client"

import Image from 'next/image';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import { useTheme } from 'next-themes';
import { AppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

type HomePageProps = {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const PromptBox = ({ isLoading, setIsLoading }: HomePageProps) => {

    const context = useContext(AppContext);
    if (!context) throw new Error("Prompt box must be within AppContextProvider");
    const { user, chats, setChats, selectedChat, setSelectedChat } = context;

    const [prompt, setPrompt] = useState("");

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    
    const isDark = theme === "dark";

    
    const handleKeyDown = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendPrompt(e);
        }
    };


    const sendPrompt = async (e: { preventDefault: () => void; }) => {
        const promptCopy = prompt;

        try {
            e.preventDefault();

            if (!user) return toast.error("Login to send message");

            if (isLoading) return toast.error("Wait for the previous prompt response");

            setIsLoading(true);

            setPrompt("");

            const userPrompt = {
                role: "user",
                content: prompt,
                timestamp: Date.now()
            };

            // Saving user prompt in chats array
            if (!selectedChat) return;
            setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat._id ? { ...chat, messages: [...chat.messages, userPrompt] } : chat));

            // Saving user prompt in selected chat
            setSelectedChat((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  messages: [...prev.messages, userPrompt],
                };
              });

              const { data } = await axios.post("/api/chat/ai", {
                chatId: selectedChat._id,
                prompt
              });

              if (data.success) {
                setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat._id ? { ...chat, messages: [...chat.messages, data.data] } : chat));

                const message = data.data.content;
                const messageTokens = message.split(" ");
                let assistantMessage = {
                    role: "model",
                    content: "",
                    timestamp: Date.now()
                };

                setSelectedChat((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev, 
                        messages: [...prev.messages, assistantMessage],
                    };
                });

                for (let i = 0; i < messageTokens.length; i++) {
                    setTimeout(() => {
                        assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
                        
                        setSelectedChat((prev) => {
                            if (!prev) return prev;
                            const updatedMessages = [...prev.messages.slice(0, -1), assistantMessage];
                            return {
                                ...prev,
                                messages: updatedMessages,
                            };
                        });
                    }, i * 100);
                }

              } else {
                toast.error(data.message);
                setPrompt(promptCopy);
              }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage || "Something went wrong.");
            setPrompt(promptCopy);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={sendPrompt} className={`w-full ${(selectedChat?.messages?.length ?? 0) > 0 ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] dark:bg-stone-200 text-white dark:text-gray-800 p-4 rounded-3xl mt-4 transition-all`}>
            <textarea onKeyDown={handleKeyDown} onChange={(e) => setPrompt(e.target.value)} value={prompt} rows={2} placeholder='Message Smart AI' className='outline-none w-full resize-none overflow-hidden break-words bg-transparent' required></textarea>
            <div className='flex flex-row-reverse'>
                <button className={`${prompt ? "bg-primary" : "bg-stone-200 dark:bg-transparent border border-gray-600"}  rounded-full p-2 cursor-pointer`}>
                    <Image src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt='' className="w-3.5 aspect-square" />
                </button> 
            </div>
        </form>
    )
}

export default PromptBox
