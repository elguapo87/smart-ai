"use client"

import { AppContext } from '@/context/AppContext';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const LoginPage = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("LoginPage must be within AppContextProvider");
    const { setUserLogin, setToken, setUserData } = context;

    const [state, setState] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (state === "Login") {
                const { data } = await axios.post("/api/userAuth/login", { email, password });
                if (data.success) {
                    toast.success(data.message);
                    setToken(data.token);
                    localStorage.setItem("token", data.token);
                    setUserData(data.user);  
                    setUserLogin(false);

                } else {
                    toast.error(data.message);
                }

            } else {
                
            }

        } catch (error) {
            const errMessage = axios.isAxiosError(error) ? error.response?.data?.message || error.message: "Something went wrong";
            toast.error(errMessage);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <form onSubmit={onSubmitHandler} className={`absolute top-0 left-0 right-0 bottom-0 z-50 ${isDark ? "bg-black/30" : "bg-stone-200/20"} backdrop-blur-sm flex justify-center items-center`}>
            <div className={`relative flex flex-col border-none gap-3 m-auto ${isDark ? "bg-stone-200 text-gray-800" : "bg-gray-800 text-stone-200"} items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-sm shadow-lg`}>

                {/* Close Button */}
                <div onClick={() => setUserLogin(false)} className='absolute top-3 right-3 font-bold text-xl cursor-pointer'>X</div>

                <p className="text-2xl font-semibold">{state !== "Login" ? "Create Account" : "Login"}</p>
                <p>Please {state !== "Login" ? "sign up" : "login"} to use Smart AI</p>

                {
                    state !== "Login"
                    &&
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} className="border border-gray-400 rounded w-full p-2 mt-1" type="text" required />
                    </div>
                }
                <div className="w-full">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className="border border-gray-400 rounded w-full p-2 mt-1" type="email" required />
                </div>
                <div className="w-full">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className="border border-gray-400 rounded w-full p-2 mt-1" type="password" required />
                </div>

                <button type='submit' className="bg-primary text-white w-full py-2 rounded-md text-base">{state !== "Login" ? "Create Account" : "Login"}</button>

                {
                    state !== "Login"
                        ?
                    <p>Already have an account? <span onClick={() => setState("Login")} className="text-primary underline cursor-pointer">Login here</span></p>
                        :
                    <p>Create a new account? <span onClick={() => setState("Sign Up")} className="text-primary underline cursor-pointer">Click here</span></p>
                }
            </div>
        </form>
    )
}

export default LoginPage
