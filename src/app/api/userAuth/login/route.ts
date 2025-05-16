import connectDB from "@/config/db";
import userAuthModel from "@/models/userAuthModel";
import generateToken from "@/utils/generateToken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
    const { email, password } = await req.json();

    try {
        const user = await userAuthModel.findOne({ email });
        if (!user) return NextResponse.json({ success: false, message: "User is not registered" });

        // Matching password with password from DB
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) return NextResponse.json({ success: false, message: "Invalid Credentials" });

        return NextResponse.json({
            success: true,
            message: "Successfully Logged in",
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email
            },
            token: generateToken(user._id.toString())
        });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        return NextResponse.json({ success: false, message: errMessage });
    }
};