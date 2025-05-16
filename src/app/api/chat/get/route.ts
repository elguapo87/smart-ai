import connectDB from "@/config/db";
import protectUser from "@/middlewares/protectUser";
import chatModel from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = await protectUser(req);
        if (!userId) return NextResponse.json({ success: false, message: "User not authenticated" });

        // Connect to database and fetch all chats for the user
        await connectDB();

        const data = await chatModel.find({ userId });
        return NextResponse.json({ success: true, data });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        return NextResponse.json({ success: false, message: errMessage });
    }
};
