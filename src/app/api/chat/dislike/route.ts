// import connectDB from "@/config/db";
// import chatModel from "@/models/chatModel";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     try {
//         const { userId } = getAuth(req);
//         if (!userId) return NextResponse.json({ success: false, message: "User not authenticated" });

//         const { chatId, messageId } = await req.json();
//         await connectDB();

//         const chat = await chatModel.findOne({ _id: chatId });
//         if (!chat) return NextResponse.json({ success: false, message: "Chat not found" });

//         const message = chat.messages.id(messageId);
//         if (!message) return NextResponse.json({ success: false, message: "Message not found" });

//         // Add like and remove dislike
//         if (!message.dislikes.includes(userId)) {
//             message.dislikes.push(userId);
//         }

//         message.likes = message.likes.filter((id: string) => id !== userId);

//         await chat.save();

//         return NextResponse.json({ success: true, message: "Message disliked" });
//     } catch (error) {
//         const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
//         return NextResponse.json({ success: false, message: errMessage });
//     }
// }

import connectDB from "@/config/db";
import protectUser from "@/middlewares/protectUser";
import chatModel from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const userId = await protectUser(req);
        if (!userId) return NextResponse.json({ success: false, message: "User not authenticated" });

        const { chatId, messageId } = await req.json();

        await connectDB();

        const chat = await chatModel.findOne({ _id: chatId });
        if (!chat) return NextResponse.json({ success: false, message: "Chat not found" });

        const message = chat.messages.id(messageId);
        if (!message) return NextResponse.json({ success: false, message: "Message not found" });

        // Add dislike and remove like
        if (!message.dislikes.includes(userId)) {
            message.dislikes.push(userId);
        }

        message.likes = message.likes.filter((id: string) => id !== userId);

        await chat.save();

        return NextResponse.json({ success: true, message: "Message disliked" });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ success: false, message: errMessage });
    }
};