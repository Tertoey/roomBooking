'use client'

import { Hotel, Room } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,Form } from "../ui/form";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
  
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { UploadButton } from "../uploadthing";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import { Button } from "../ui/button";
import { Loader2, XCircle } from "lucide-react";
import axios from 'axios'
import useLocation from "@/hooks/useLacation";
import { ICity, IState } from "country-state-city";

interface AddHotelFormProps{
    hotel: HotelWithRooms | null;
}

export type HotelWithRooms = Hotel & {
    room: Room[]
}
const formSchema = z.object({
    title: z.string().min(3,{
        message: 'Title must be at least 3'
    }),
    description: z.string().min(10,{
        message: 'description must be at least 10'
    }),
    image: z.string().min(1,{
        message: 'Image is require'
    }),
    country: z.string().min(1,{
        message: 'Country is require'
    }),
    state: z.string().optional(),
    city:  z.string().optional(),
    locationDescription: z.string().min(10,{
        message: 'description must be at least 10'
    }),
    gym: z.boolean().optional(),
    spa: z.boolean().optional(),
    laundry: z.boolean().optional(),
    restaurant: z.boolean().optional(),
    freeparking: z.boolean().optional(),
    bikeRental: z.boolean().optional(),
    freeWifi: z.boolean().optional(),
    movieNight: z.boolean().optional(),
    swimmingPool: z.boolean().optional(),
    coffeeShop: z.boolean().optional(),
})
const AddHotelForm = ({hotel}:AddHotelFormProps) => {
    const [image,setImage] = useState<string | undefined>(hotel?.image)
    const [imageIsDelete, setImageIsDelete] = useState (false)
    const [state,setState] = useState<IState[]>([])
    const [city,setCity] = useState<ICity[]>([])
    const [isLoading,setIsLoading] = useState(false)

    const {toast} = useToast()
    const {getAllCountries,getCountryState,getStateCities} = useLocation()
    const country = getAllCountries()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title:"",
            description:"",
            image:"",
            country:"",
            state:"",
            city:"",
            locationDescription:"",
            gym: false,
            spa: false,
            laundry: false,
            restaurant: false,
            freeparking: false,
            bikeRental: false,
            freeWifi: false,
            movieNight: false,
            swimmingPool: false,
            coffeeShop: false,
        },
      })

      useEffect(()=>{
        const seletedCountry = form.watch("country")
        const countryState = getCountryState(seletedCountry)
        if(countryState){
            setState(countryState)
        }
      },[form.watch("country")])

      useEffect(()=>{
        const seletedCountry = form.watch("country")
        const seletedState = form.watch("state")
        const stateCity = getStateCities(seletedCountry,seletedState)
        if(stateCity){
            setCity(stateCity)
        }
      },[form.watch("country"),form.watch("state")],)
      
      function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
      }
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
                variant:'success',
                description:'Image removed'
            })
        }).finally(()=>{
            setImageIsDelete(false)
        })
      }
    return ( 
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className="text-lg font-semibold">{hotel ? 'Update you hotel':'Describe your hotel'}</h3>
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex-1 flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hotel Title *</FormLabel>
                                        <FormDescription>
                                            Provide your hotel name
                                        </FormDescription>
                                        <FormControl>
                                            <Input placeholder="Hotel" {...field} />
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
                                        <FormLabel>Description *</FormLabel>
                                        <FormDescription>
                                            Provide your hotel description
                                        </FormDescription>
                                        <FormControl>
                                            <Textarea placeholder="Description" {...field} />
                                        </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <FormLabel>Choose Amerities</FormLabel>
                                <FormDescription> Choose Amanities popular in your hotel</FormDescription>
                                    <div className="grid grid-cols-4 gap-4 mt-2">
                                        <FormField
                                            control={form.control}
                                            name="gym"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Gym</FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="spa"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Spa</FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="laundry"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Laundry</FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="restaurant"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Restaurant</FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="freeparking"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Free parking</FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bikeRental"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Bike Rental</FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="freeWifi"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Free Wifi</FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="movieNight"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Movie Night</FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="swimmingPool"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Swimming Pool</FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="coffeeShop"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value}
                                                        onCheckedChange={field.onChange}/>
                                                    </FormControl>
                                                    <FormLabel>Coffee Shop</FormLabel>
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
                                    <FormDescription>Choose your hotel picture</FormDescription>
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
                            )} />
                        </div>
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="grid grid-col-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name='country'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Country*</FormLabel>
                                            <FormDescription>Which country is your property located</FormDescription>
                                            <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue defaultValue={field.value} placeholder="Select a Country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {country.map((country) =>{
                                                        return <SelectItem key={country.isoCode} value={country.isoCode}>{country.name}</SelectItem>
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='state'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select State</FormLabel>
                                            <FormDescription>Which state is your property located</FormDescription>
                                            <Select disabled={isLoading || state.length<1} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue defaultValue={field.value} placeholder="Select a State" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {state.map((state) =>{
                                                        return <SelectItem key={state.isoCode} value={state.isoCode}>{state.name}</SelectItem>
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>
                                <FormField
                                    control={form.control}
                                    name='city'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select City</FormLabel>
                                            <FormDescription>Which city is your property located</FormDescription>
                                            <Select disabled={isLoading || city.length<1} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue defaultValue={field.value} placeholder="Select a City" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {city.map((city) =>{
                                                        return <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                control={form.control}
                                name="locationDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location Description *</FormLabel>
                                        <FormDescription>
                                            Provide your hotel Location Description
                                        </FormDescription>
                                        <FormControl>
                                            <Textarea placeholder="Location Description" {...field} />
                                        </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </Form>
        </div>
     );
}
 
export default AddHotelForm;