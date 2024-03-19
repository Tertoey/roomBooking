import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs";
interface HotelPageProps {
    params: {
        hotelId:string
    }
}

const Hotel = async({params}:HotelPageProps) => {
    console.log('hotelId',params.hotelId)
    const hotel= await getHotelById(params.hotelId)
    const {userId} = auth()
    if (!userId) return <div>Not Authen....</div>
    if (hotel && hotel.userId !== userId) return <div>Access Denied</div>
    return ( 
        <div>
            <AddHotelForm hotel={hotel}/>
        </div>
     );
}
 
export default Hotel;