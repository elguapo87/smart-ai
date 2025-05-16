import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import userAuthModel from "@/models/userAuthModel";
import protectUser from "@/middlewares/protectUser";

export async function GET(req: NextRequest) {
    await connectDB();

    try {
        const userId = await protectUser(req);

        const user = await userAuthModel.findById(userId);
        if (!user) return NextResponse.json({ success: false, message: "User not found" });

        return NextResponse.json({
            success: true,
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}

