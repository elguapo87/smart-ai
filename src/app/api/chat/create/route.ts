import connectDB from "@/config/db";
import protectUser from "@/middlewares/protectUser";
import chatModel from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const userId = await protectUser(req);
        if (!userId) return NextResponse.json({ success: false, message: "User not authenticated" });

        // Prepare chat data to be saved in the database
        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            likes: [],
            dislikes: []
        };

        // Connect to the database and create a new chat
        await connectDB();

        await chatModel.create(chatData);

        return NextResponse.json({ success: true, message: "Chat Created" });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        return NextResponse.json({ success: false, message: errMessage });
    }
};


