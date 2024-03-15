import {Country,State,City} from 'country-state-city'
const useLocation = ()=>{
    const getCountryByCode = (countryCode:string)=>{
        return Country.getAllCountries().find((country)=>country.isoCode === countryCode)
    } 
    const getStateByCode = (countryCode:string,stateCode:string)=>{
        const state = State.getAllStates().find((state)=>
        state.countryCode === countryCode && state.isoCode === stateCode)
        if(!state) return null;
        return state
    } 

    const getCountryState = (countryCode:string)=>{
        return  State.getAllStates().filter((state)=>state.countryCode === countryCode)
    }

    const getStateCities = (countryCode:string,stateCode:string|any)=>{
        return  City.getAllCities().filter((city)=>city.countryCode === countryCode && city.stateCode === stateCode)
    }

    return{
        getAllCountries: Country.getAllCountries,
        getCountryByCode,
        getStateByCode,
        getCountryState,
        getStateCities
    }
}

export default useLocation