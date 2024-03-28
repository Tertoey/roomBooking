import prismadb from "@/lib/prismadb"
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:Request){
    try{

        const room = await prismadb.hotel.findMany({
            select:{
                rooms:true
            }
        })
        const test = await axios.get('https://jsonplaceholder.typicode.com/todos/1')

        return NextResponse.json(room)
    }catch(error){
        console.log(`Error at /api/room POST: ${error}`)
        return new NextResponse('Internal Server error',{status:500})
    }
}