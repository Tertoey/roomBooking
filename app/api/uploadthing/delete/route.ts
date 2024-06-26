import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi

export async function POST(req:Request) {
    const {userId} =  auth()
    if(!userId){
        return new NextResponse ("Unauthorized",{status:401})
    }
    const {imageKey} = await req.json()
    console.log(imageKey)
    try{
        const res = await utapi.deleteFiles(imageKey)
        console.log(res,"Ok")
        return NextResponse.json(res)
    }catch(error){
        console.log("error at uploathing/delete",error)
        return new NextResponse("Internal server error",{status:500})
    }
}