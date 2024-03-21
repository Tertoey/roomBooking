'use client'

import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,Form } from "../ui/form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Pencil, PencilLine, XCircle } from "lucide-react";
import { UploadButton } from "../uploadthing";
import { toast } from "../ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AddRoomFormProps{
    hotel?: Hotel & {
        room: Room[]
    }
    room?: Room
    // close dialogue when submit
    handleDailogueOpen:() => void
}

const formSchema = z.object({
    title: z.string().min(3,{
        message:"Title must atleast 3 charecters"
    }),
    description: z.string().min(3,{
        message:"Description must atleast 10 charecters"
    }),
    bedCount: z.coerce.number().min(1,{message:"Bed count is required"}),
    guestCount: z.coerce.number().min(1,{message:"Guest count is required"}),
    bathroomCount: z.coerce.number().min(1,{message:"Bathroom count is required"}),
    kingBed: z.coerce.number().min(0),
    queenBed: z.coerce.number().min(0),
    image: z.string().min(1,{
        message:"Image is required"
    }),
    breakfastPrice: z.coerce.number().optional(),
    roomPrice: z.coerce.number().min(1,{
        message:"Room price is required"
    }),
    roomService: z.boolean().optional(),
    tv: z.boolean().optional(),
    balcony: z.boolean().optional(),
    freewifi: z.boolean().optional(),
    cityView: z.boolean().optional(),
    occeanView: z.boolean().optional(),
    mountainView: z.boolean().optional(),
    airCondition: z.boolean().optional(),
    soundProof: z.boolean().optional(),
})

const AddRoomForm = ({hotel, room, handleDailogueOpen}:AddRoomFormProps) => {
    const [image,setImage] = useState<string | undefined>(room?.image)
    const [imageIsDelete, setImageIsDelete] = useState (false)
    const [isLoading,setIsLoading] = useState(false)
    const router = useRouter()
    // const {toast} = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: room ||{
            title:'',
            description:'',
            bedCount:0,
            guestCount:0,
            bathroomCount:0,
            kingBed:0,
            queenBed:0,
            image:'',
            breakfastPrice:0,
            roomPrice:0,
            roomService:false,
            tv:false,
            balcony:false,
            freewifi:false,
            cityView:false,
            occeanView:false,
            mountainView:false,
            airCondition:false,
            soundProof:false,
        },
      })

      useEffect(()=>{
        if(typeof image === 'string'){
            form.setValue('image',image,{
                shouldValidate:true,
                shouldDirty:true,
                shouldTouch:true,
            })
        }
      },[image])
      
      const handleImageDelete = (image:string)=>{
        setImageIsDelete(true)
        const imageKey = image.substring(image.lastIndexOf('/')+1)
        axios.post('/api/uploadthing/delete',{imageKey}).then((res)=>{
            if(res.data.success){
                setImage('')
                toast({
                    variant:'success',
                    description:'Image removed'
                })
            }
        }).catch(()=>{
            toast({
                variant:'destructive',
                description:'Something went wrong'
            })
        }).finally(()=>{
            setImageIsDelete(false)
        })
      }
      function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        if(hotel && room){
            //update
            axios.patch(`/api/room/${room.id}`,values).then((res)=>{
                toast({
                    variant:'success',
                    description:'Room Update'
                })
                router.refresh()
                setIsLoading(false)
                handleDailogueOpen()
            }).catch((err)=>{
                console.log(err)
                toast({
                    variant:'destructive',
                    description:'Something went wrong'
                })
                setIsLoading(false)
            })
        }else{
            //create
            if(!hotel) return;
            axios.post('/api/room',{...values,hotelId:hotel.id}).then(res =>{
                toast({
                    variant:'success',
                    description:'Room Created'
                })
                router.refresh()
                setIsLoading(false)
                handleDailogueOpen()
            }).catch((err)=>{
                console.log(err)
                toast({
                    variant:'destructive',
                    description:'Something went wrong'
                })
                setIsLoading(false)
            })
        }
      }

    return (
        <div className="max-h-[75vh] overflow-y-auto px-2">
            <Form {...form}>
                <form className="space-y-6 mb-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Room Title *</FormLabel>
                                <FormDescription>
                                    Provide your room name
                                </FormDescription>
                                <FormControl>
                                    <Input placeholder="Room name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> 
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Room Description *</FormLabel>
                                <FormDescription>
                                    Provide your room description
                                </FormDescription>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <FormLabel>Choose Room Amenities</FormLabel>
                        <FormDescription>What make this room choice?</FormDescription>
                        <div className="grid grid-cols-2 gap-4 mt-2 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="roomService"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel>Room Service</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tv"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel>TV</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="balcony"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel>Balcony</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="freewifi"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel>Free WIFI</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cityView"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel>City View</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="occeanView"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel>Occean View</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mountainView"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel>Mountain View</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="airCondition"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel>Air Condition</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="soundProof"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                        <FormControl>
                                            <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel>Sound Proof</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <FormField 
                            control={form.control}
                            name="image"
                            render={({field})=>(
                                <FormItem className="flex flex-col space-y-3">
                                    <FormLabel>Upload Image *</FormLabel>
                                    <FormDescription>Choose your room picture</FormDescription>
                                    <FormControl>
                                        {image ? <>
                                            <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                                                <Image fill src={image} alt="Hotel image" className="object-contain"/>
                                                <Button onClick={()=> handleImageDelete(image)} type="button" size='icon' variant='ghost' className="absolute right-[-12px] top-0">
                                                    {imageIsDelete ? <Loader2/> : <XCircle/>}
                                                </Button>
                                            </div>
                                            </> : <>
                                                <div className="flex flex-col items-center max-w[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                                                    <UploadButton
                                                        endpoint="imageUploader"
                                                        onClientUploadComplete={(res) => {
                                                        // Do something with the response
                                                        console.log("Files: ", res);
                                                        setImage(res[0].url)
                                                        toast({
                                                            variant:"success",
                                                            description:"Upload Completed"
                                                        })
                                                        }}
                                                        onUploadError={(error: Error) => {
                                                        // Do something with the error.
                                                        toast({
                                                            variant:"destructive",
                                                            description:`Error ${error.message}`
                                                        })
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        }
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <div className="flex flex-row gap-6">
                            <div className="flex-1 flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="roomPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Room Price in USD *</FormLabel>
                                            <FormDescription>
                                                State the price for staying in this room for 24hrs
                                            </FormDescription>
                                            <FormControl>
                                                <Input type='number' min={1} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bedCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bed Count *</FormLabel>
                                            <FormDescription>
                                                How many beds are available in this room
                                            </FormDescription>
                                            <FormControl>
                                                <Input type='number' min={1} max={8} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guestCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Guest Count *</FormLabel>
                                            <FormDescription>
                                                How many guest are allowed in this room
                                            </FormDescription>
                                            <FormControl>
                                                <Input type='number' min={1} max={8} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bathroomCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bathroom Count *</FormLabel>
                                            <FormDescription>
                                                How many bathroom are in this room
                                            </FormDescription>
                                            <FormControl>
                                                <Input type='number' min={1} max={8} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />   
                            </div>
                            <div className="flex-1 flex flex-col gap-6">
                            <FormField
                                    control={form.control}
                                    name="breakfastPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Breakfast Price in USD</FormLabel>
                                            <FormDescription>
                                                State the price for Breakfast
                                            </FormDescription>
                                            <FormControl>
                                                <Input type='number' min={1} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="kingBed"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>King Bed</FormLabel>
                                            <FormDescription>
                                                How many king beds are in this room
                                            </FormDescription>
                                            <FormControl>
                                                <Input type='number' min={1} max={8} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="queenBed"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Queen Beds</FormLabel>
                                            <FormDescription>
                                                How many queen beds are in this room
                                            </FormDescription>
                                            <FormControl>
                                                <Input type='number' min={1} max={8} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />   
                            </div>
                        </div>
                        <div className="pt-4 pb-2">
                            {/* Update or create hotel */}
                            {room ? 
                                <Button type='button' onClick={form.handleSubmit(onSubmit)} className="max-w-[150px]" disabled={isLoading}>
                                    {isLoading? <><Loader2 className="mr-2 h-4 w-4"/>Updating</>:
                                        <><PencilLine className="mr-2 h-4 w-4"/>Update</>}
                                </Button>
                                :<Button type="button" onClick={form.handleSubmit(onSubmit)} className="max-w-[150px]" disabled={isLoading}>
                                    {isLoading? <><Loader2 className="mr-2 h-4 w-4"/>Creating</>:
                                        <><Pencil className="mr-2 h-4 w-4"/>Create Room</>}
                                </Button>}
                        </div>
                </form>
            </Form>
        </div>
    );
}
 
export default AddRoomForm;