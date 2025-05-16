"use client";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type MessageType = {
    _id?: string;
    role: string;
    content: string;
    timestamp: number;
    likes?: string[];
    dislikes?: string[];
};

type ChatsType = {
    _id?: string;
    name: string;
    messages: MessageType[];
    userId: string;
    likes: string[];
    dislikes: string[];
};

type UserType = {
    _id: string;
    name: string;
    email: string;
};

interface AppContextType {
    chats: ChatsType[];
    setChats: Dispatch<SetStateAction<ChatsType[]>>;
    selectedChat: ChatsType | null;
    setSelectedChat: Dispatch<SetStateAction<ChatsType | null>>;
    createNewChat: () => Promise<void>;
    fetchUsersChats: () => Promise<void>;
    userLogin: boolean,
    setUserLogin: Dispatch<SetStateAction<boolean>>;
    token: string | null;
    setToken: Dispatch<SetStateAction<string | null>>;
    userData: UserType | null;
    setUserData: Dispatch<SetStateAction<UserType | null>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [chats, setChats] = useState<ChatsType[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatsType | null>(null);
    const [userLogin, setUserLogin] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserType | null>(null);

    const fetchUserData = async () => {
        try {
            const { data } = await axios.get("/api/userAuth/me", {
                headers: { token }
            });

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message || "Failed to load user data");
            }
        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage || "Something went wrong.");
        }
    };

    const createNewChat = async () => {
        try {
            if (!token) return;

            await axios.post("/api/chat/create", {}, {
                headers: { token }
            });

            await fetchUsersChats();

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage || "Something went wrong.");
        }
    };


    const fetchUsersChats = async () => {
        try {
            const { data } = await axios.get("/api/chat/get", {
                headers: { token }
            });

            if (data.success) {
                setChats(data.data);

                if (data.data.length === 0) {
                    await createNewChat();
                    return fetchUsersChats();

                } else {
                    data.data.sort(
                        (
                            a: { updatedAt: string | number | Date },
                            b: { updatedAt: string | number | Date }
                        ) =>
                            new Date(b.updatedAt).getTime() -
                            new Date(a.updatedAt).getTime()
                    );

                    setSelectedChat(data.data[0]);
                }

            } else {
                toast.error(data.message || "Failed to load chats.");
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage || "Something went wrong.");
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserData();
            fetchUsersChats();
        }
    }, [token]);

    const value = {
        chats, setChats,
        selectedChat, setSelectedChat,
        createNewChat,
        fetchUsersChats,
        userLogin, setUserLogin,
        token, setToken,
        userData, setUserData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;