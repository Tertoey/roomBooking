'use client'

import { usePathname, useRouter } from "next/navigation";
import { HotelWithRooms } from "./AddHotelForm";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin, Waves } from "lucide-react";
import useLocation from "@/hooks/useLacation";
import { Button } from "../ui/button";

const HotelCard = ({hotel}:{hotel:HotelWithRooms}) => {
    const pathname = usePathname()
    const isMyHotel = pathname.includes("my-hotels")
    const router = useRouter()
    const {getCountryByCode} = useLocation()
    const country = getCountryByCode(hotel.country)
    return (
        <div onClick={()=>!isMyHotel && router.push(`/hotel-details/${hotel.id}`)} className={cn('col-span-1 cursor-pointer transition hover:scale-105',isMyHotel&&'cursor-default')}>
            <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
                <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
                    <Image fill src={hotel.image} alt={hotel.title} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-1 text-sm">
                    <h3 className="font-semibold text-xl">{hotel.title}</h3>
                    <div className="text-primary/90">{hotel.description.substring(0,45)}...</div>
                    <div className="text-primary/90">
                        <AmenityItem>
                            <MapPin className="w-4 h-4"/> {country?.name} {hotel.city}
                        </AmenityItem>
                        {hotel.swimmingPool && <AmenityItem><Waves className="h-4 w-4"/>Pool</AmenityItem>}
                        {hotel.gym && <AmenityItem><Dumbbell className="h-4 w-4"/>Gym</AmenityItem>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {hotel?.rooms[0]?.roomPrice && <>
                                <div className="font-semibold text-base">${hotel?.rooms[0].roomPrice}</div>
                                <div>/24 hrs</div>    
                            </>
                            }
                        </div>
                        {isMyHotel && <Button onClick={()=> router.push(`/hotel/${hotel.id}`)} variant='outline'>Edit</Button>}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default HotelCard;