import { generateToken } from "@/lib/jwt"
import { connectDB } from "@/lib/mongodb"
import UserModel from "@/models/User.model"
import { ApiResponse } from "@/types/api.types"
import { RegisterBody } from "@/types/user.types"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
    try {
        await connectDB()
        let body:RegisterBody=await req.json()
        let {name,email,mobile,password}=body

        if(!name || !email || !mobile || !password){
            return NextResponse.json<ApiResponse>({success:false, message:"All fields are required"},{status:400})
        } ;

        let isExisted = await UserModel.findOne({email})
        if(isExisted){
            return NextResponse.json<ApiResponse>({success:false, message:"User already exists"},{status:409})
        }

        let newUser = await UserModel.create({name,email,mobile,password})

        let token  = generateToken({userId:newUser._id})

        let response = NextResponse.json<ApiResponse>({success:true, message:"User registered successfully", data:{
            user:{
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email,    

            }
        }},{status:201})
        response.cookies.set("token",token,{httpOnly:true,sameSite:"lax", maxAge:60*60*24*7})
        return response
        
    } catch (error) {
        console.log("error in register api",error)
        return NextResponse.json({
            success:false,
            message:"Internal server error",
            error:error instanceof Error ? error.message : "Unknown error"
        },{status:500
        })
    }
}