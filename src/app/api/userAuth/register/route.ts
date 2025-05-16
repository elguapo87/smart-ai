import connectDB from "@/config/db";
import userAuthModel from "@/models/userAuthModel";
import generateToken from "@/utils/generateToken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) return NextResponse.json({ success: false, message: "Missing Details" });
        
    try {
        // Check if user already exists
        const existingUser = await userAuthModel.findOne({ email });
        if (existingUser) return NextResponse.json({ success: false, message: "User already registered" });

        // Check password length
        if (password.length < 8) return NextResponse.json({ success: false, message: "Password must have at least 8 characters" });

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userAuthModel.create({
            name,
            email,
            password: hashedPassword
        });

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email
            },
            token: generateToken(newUser._id.toString())
        });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        return NextResponse.json({ success: false, message: errMessage });
    }
}