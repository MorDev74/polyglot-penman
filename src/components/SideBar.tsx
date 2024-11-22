"use client"

import { useContext } from "react";
import { ComboMenu } from "@/components/ComboMenu";
import { DevContext } from "@/hooks/context";
import { srcLangs,destLangs,writingStyles } from "@/utils/config";
export function SideBar() {
    const { devMessages } = useContext(DevContext);
    return (

        <div className="bg-gray-800 flex flex-col gap-2 p-2">
            <div className="text-xl font-bold border-b"> Settings </div>

            <ComboMenu name={"Source Language"} storageKey={"srcLang"} list={srcLangs}/>
            <ComboMenu name={"Destination Language"} storageKey={"destLang"} list={destLangs}/>
            <ComboMenu name={"Writing Style"} storageKey={"writingStyle"} list={writingStyles}/>

            <div className="border-t"> API Count </div>

            <div className="border-t h-full">  
                Dev
                <div>{`NODE_ENV : ${process.env.NODE_ENV}`}</div>
                <div className="flex flex-col gap-1 bg-black rounded-sm p-2 w-[300px] overflow-hidden">
                    {devMessages.map((msg,index) => (
                        <div 
                            key={index}
                            className="text-white border border-gray-800 rounded-md"
                        >{msg}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}