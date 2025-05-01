'use client'
import { AllHoods } from "@/_lib/centers/getdata";
import { useState } from "react";

export default function Test() {

    const [hoods, sethoods] = useState([])
    const [loading, setloading] = useState(false)

    async function handleClick (){
        setloading(true)
        const result = await AllHoods();
        setloading(false)
        sethoods(result?.map(item => item.name))
    }

    return(
        <div>
            <button onClick={handleClick}>
                {loading? '...' : 'click to log the data'}
            </button>
            {hoods?.map((item, id)=>
                <li key={id}> {item} </li>
            )}
        </div>
    )
}