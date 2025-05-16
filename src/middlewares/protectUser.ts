import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const protectUser = async (req: NextRequest) => {
    try {
        const token = req.headers.get("token");
        if (!token) {
            throw new Error("Not Authorized, No Token Provided");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        return decoded.id;

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Not Authorized");
    }
};

export default protectUser;