import { generateToken } from "@/lib/jwt"
import { connectDB } from "@/lib/mongodb"
import UserModel from "@/models/User.model"
import { ApiResponse } from "@/types/api.types"
import { LoginBody } from "@/types/user.types"

import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
    try {
        await connectDB()
        let body:LoginBody=await req.json()
        let {email,password}=body

        if(!email || !password){
            return NextResponse.json<ApiResponse>({success:false, message:"Email and password are required"},{status:400})
        } ;

        let isExisted = await UserModel.findOne({email})
        if(!isExisted){
            return NextResponse.json<ApiResponse>({success:false, message:"Invalid email or password"},{status:404})
        }

        let matchPass=isExisted.comparePassword(password)
        if(!matchPass){
            return NextResponse.json<ApiResponse>({success:false, message:"Invalid email or password"},{status:404})
        }

        let token  = generateToken({userId:isExisted._id})

        let response = NextResponse.json<ApiResponse>({success:true, message:"User logged in successfully", data:{
            user:{
                _id:isExisted._id,
                email:isExisted.email
            }
        }},{status:201})
        response.cookies.set("token",token,{httpOnly:true,sameSite:"lax", maxAge:60*60*24*7})
        return response
        
    } catch (error) {
        console.log("error in login api",error)
        return NextResponse.json({
            success:false,
            message:"Internal server error",
            error:error instanceof Error ? error.message : "Unknown error"
        },{status:500
        })
    }
}