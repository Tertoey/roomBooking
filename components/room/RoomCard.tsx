"use client";

import { Bookings, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Loader2,
  Mountain,
  Pencil,
  Plus,
  Ship,
  Trash,
  User,
  UtensilsCrossed,
  Volume,
  VolumeX,
  Wand2,
  Wifi,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import AddRoomForm from "./AddRoomForm";
import { toast } from "../ui/use-toast";
import axios from "axios";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRooms";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  booking?: Bookings[];
}

const RoomCard = ({ hotel, room, booking = [] }: RoomCardProps) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const pathname = usePathname();
  const userId = useAuth();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const [days, setDays] = useState(1);

  // console.log(pathname) // /hotel/hotelId
  const isHotelDetailsPage = pathname.includes("hotel-details");

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      setDays(dayCount);
      if (dayCount && room.roomPrice) {
        if (includeBreakfast && room.breakfastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakfastPrice
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      } else {
        setTotalPrice(room.roomPrice);
      }
    }
  }, [date, room.roomPrice, includeBreakfast]);

  const router = useRouter();
  const handleDailogueOpen = () => {
    setOpen((prev) => !prev);
  };
  const handleDeleteRoom = async (room: Room) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);
    console.log(imageKey);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            setIsLoading(false);
            toast({
              variant: "success",
              description: "Room deleted",
            });
            router.refresh();
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: "Something went wrong",
            });
          });
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Something went wrong at Uploadthing",
        });
      });
  };

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Please login before book a room",
      });

    if (!hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wronge",
      });

    if (date?.from && date?.to) {
      setBookingIsLoading(true);
      const bookingRoomData = {
        room,
        totalPrice,
        breakFastInclude: includeBreakfast,
        startDate: date.from,
        endDate: date.to,
      };

      setRoomData(bookingRoomData);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastInclude: includeBreakfast,
            totalPrice: totalPrice,
          },
          payment_intent_id: paymentIntentId,
        }),
      })
        .then((res) => {
          setBookingIsLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }
          return res.json();
        })
        .then((data: any) => {
          console.log(data);
          setClientSecret(data.paymentIntent.client_secret);
          setPaymentIntentId(data.paymentIntent.id);
          router.push("/book-room");
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: `${error.message}`,
          });
        });
    } else {
      toast({
        variant: "destructive",
        description: "Please select date",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" />
            {room.bedCount} Beds
          </AmenityItem>
          <AmenityItem>
            <User className="h-4 w-4" />
            {room.guestCount} Guest
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" />
            {room.bathroomCount} Bath
          </AmenityItem>
          {!!room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.kingBed} King Beds
            </AmenityItem>
          )}
          {!!room.queenBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.queenBed} Queen Beds
            </AmenityItem>
          )}
          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" />
              Room Services
            </AmenityItem>
          )}
          {room.freewifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free WiFi
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-4" />
              City view
            </AmenityItem>
          )}
          {room.occeanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean view
            </AmenityItem>
          )}
          {room.mountainView && (
            <AmenityItem>
              <Mountain className="h-4 w-4" />
              Mountain view
            </AmenityItem>
          )}
          {room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air Condition
            </AmenityItem>
          )}
          {room.soundProof && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" />
              Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="grid grid-cols-2 text-sm">
          <div>
            Room Price: <span className="font-bold">${room.roomPrice}</span>
            <span> /day</span>
          </div>
          {!!room.breakfastPrice && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${room.breakfastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>
      <CardFooter>
        {isHotelDetailsPage ? (
          <div className=" flex flex-col gap-6">
            <div>
              <div className="mb-2">
                Select Date that you will spend in this room
              </div>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
            {room.breakfastPrice > 0 && (
              <div>
                <div className="mb-2">Do you want to add breakfast?</div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breakfast"
                    onCheckedChange={(value) => setIncludeBreakfast(!!value)}
                  />
                  <label htmlFor="breakfast" className="text-sm">
                    Include Breakfast
                  </label>
                </div>
              </div>
            )}
            <div>
              Total Price: <span className="font-bold">${totalPrice}</span> for{" "}
              <span className="font-bold">{days} Days</span>
            </div>
            <Button
              onClick={() => handleBookRoom()}
              disabled={bookingIsLoading}
              type="button"
            >
              {bookingIsLoading ? (
                <Loader2 className="mr-2 h-4 w-4" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {bookingIsLoading ? "Loading..." : "Book Room"}
            </Button>
          </div>
        ) : (
          <div className="flex w-full justify-between">
            <Button
              disabled={isLoading}
              type="button"
              variant="ghost"
              onClick={() => handleDeleteRoom(room)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4" />
                  Deleting
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <Button
                type="button"
                variant="outline"
                className="max-w-[150px] "
                asChild
              >
                <DialogTrigger>
                  <Pencil className="mr-2 h-4 w-4" />
                  Update room
                </DialogTrigger>
              </Button>
              <DialogContent className="max-w-[900px] w-[90%]  ">
                <DialogHeader className="px-2">
                  <DialogTitle>Update Room</DialogTitle>
                  <DialogDescription>
                    Make change to this room
                  </DialogDescription>
                </DialogHeader>
                <AddRoomForm
                  hotel={hotel}
                  room={room}
                  handleDailogueOpen={handleDailogueOpen}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
