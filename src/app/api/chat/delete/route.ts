import connectDB from "@/config/db";
import protectUser from "@/middlewares/protectUser";
import chatModel from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const userId = await protectUser(req);
        if (!userId) return NextResponse.json({ success: false, message: "User not authenticated" });

        const { chatId } = await req.json();

        // Connect to the database and delete the chat
        await connectDB();

        await chatModel.findByIdAndDelete({ _id: chatId, userId });

        return NextResponse.json({ success: true, message: "Chat deleted" });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        return NextResponse.json({ success: false, error: errMessage });
    }
};