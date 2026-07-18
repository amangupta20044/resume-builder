import { cookies } from "next/headers"
import { verifyToken } from "./jwt"

export async function getCurrentUser(){
    const storeCookies = await cookies()

    const token = storeCookies.get("token")?.value

    if(!token) throw new Error("No token found")

    const decode = verifyToken(token)

    if(!decode) throw new Error("Invalid token")

    return decode.userId
}