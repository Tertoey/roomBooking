'use client'

import { Bookings } from "@prisma/client";
import { HotelWithRooms } from "./AddHotelForm";
import useLocation from "@/hooks/useLacation";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { BikeIcon, Car, Dumbbell, Eye, MapPin, Wifi} from "lucide-react";
import { FaCoffee, FaHamburger, FaSpa, FaSwimmer, FaTshirt } from "react-icons/fa";
import RoomCard from "../room/RoomCard";

const HotelDetailsClient = ({hotel, bookings}:{hotel: HotelWithRooms,bookings?:Bookings[]}) => {
    const {getCountryByCode, getStateByCode} = useLocation()
    const country = getCountryByCode(hotel.country)
    const state = getStateByCode(hotel.country,hotel.state)

    return (
        <div className="flex flex-col gap-6 pb-2 z-0">
            <div className="aspect-square overflow-hidden relative w-full h-[200px] md:h-[400px] rounded-lg">
                <Image fill src={hotel.image} alt={hotel.title} className="object-cover"/>
            </div>
            <div>
                <h3 className="font-semibold text-xl md:text-3xl">{hotel.title}</h3>
                <div className="font-semibold mt-4">
                    <AmenityItem><MapPin className="h-4 w-4"/>{country?.name} {hotel.city}</AmenityItem>
                </div>
                <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
                <p className="text-primary/90 mb-2">{hotel.locationDescription}</p>
                <h3 className="font-semibold text-lg mt-4 mb-2">About this hotel</h3>
                <p className="text-primary/90 mb-2">{hotel.description}</p>
                <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
                    {hotel.swimmingPool && <AmenityItem><FaSwimmer size={18}/>Pool</AmenityItem>}
                    {hotel.gym && <AmenityItem><Dumbbell size={18}/>Gym</AmenityItem>}
                    {hotel.spa && <AmenityItem><FaSpa size={18}/>Spa</AmenityItem>}
                    {hotel.laundry && <AmenityItem><FaTshirt size={18}/>Laundry</AmenityItem>}
                    {hotel.restaurant && <AmenityItem><Dumbbell size={18}/>Restaurant</AmenityItem>}
                    {hotel.freeparking && <AmenityItem><FaHamburger size={18}/>Parking</AmenityItem>}
                    {hotel.bikeRental && <AmenityItem><BikeIcon size={18}/>Bike a Rent</AmenityItem>}
                    {hotel.freeWifi && <AmenityItem><Wifi size={18}/>Wifi</AmenityItem>}
                    {hotel.movieNight && <AmenityItem><Eye size={18}/>Movie</AmenityItem>}
                    {hotel.coffeeShop && <AmenityItem><FaCoffee size={18}/>Cafe</AmenityItem>}
                </div>
            </div>
                <div>
                    {hotel.rooms.length >0 && <div>
                        <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {hotel.rooms.map((room)=>{
                                return <RoomCard hotel={hotel} room={room} key={room.id} booking={bookings}/>
                            })}
                        </div>
                        </div>}
                </div>
        </div>
    );
}
 
export default HotelDetailsClient;