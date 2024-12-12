"use client"

import { useState,useEffect } from "react";
import Image from "next/image";
import { ComboMenu } from "@/components/ComboMenu";
import { srcLangs,destLangs,writingStyles,llmNames } from "@/utils/config";
import { FiSidebar } from "react-icons/fi";
import { RangeSlider } from "./RangeSlider";
export function SideBar() {
    const [collapse, setCollapse] = useState(false);

    useEffect(() => {
    },[])

    return (
        <div className={`bg-gray-800 flex flex-col p-2
            transition-all duration-200 ${collapse ? "w-[48px]" : "w-1/5"}
        `}>
            <div className="flex flex-row justify-between">
                <FiSidebar 
                    size={"36"} 
                    onClick={() => {setCollapse(!collapse)}}
                    className="cursor-pointer"
                />

                {collapse
                ? null
                : <div className={`text-xl font-bold ${collapse ? "w-0": "w-auto"}`}>Settings</div>}
            </div>

            { collapse
                ? null
                : <div className="flex flex-col gap-4 h-full">
                    <hr className="border-gray-500"/>

                    <ComboMenu name={"Source Language"} storageKey={"srcLang"} list={srcLangs}/>
                    <ComboMenu name={"Destination Language"} storageKey={"destLang"} list={destLangs}/>
                    <ComboMenu name={"Writing Style"} storageKey={"writingStyle"} list={writingStyles}/>
                    <ComboMenu name={"LLMs"} storageKey={"llmName"} list={llmNames}/>
                    <RangeSlider 
                        storageKey={"temperature"}
                        initValue={"0.5"} 
                        minValue={"0"} 
                        maxValue={"1"} 
                        step={0.1}
                    />

                    <hr className="border-gray-500"/>

                    <div className="flex flex-col gap-1 h-full my-1 overflow-hidden">
                        <div className="font-bold">How To Use</div>
                        <p>1. Select &quot;Source Language&quot;, &quot;Destination Language&quot;, &quot;Writing Style&quot;</p>
                        <p>2. Write prompt template</p>
                        <p>3. Write source language essay</p>
                        <p>4. Click &quot;Generate&quot; button</p>
                    </div>

                    <hr className="border-gray-500"/>

                    <div className="flex flex-row justify-end">
                        <a 
                            target="_blank" 
                            href={"https://github.com/MorDev74/polyglot-penman"}
                            rel="noopener noreferrer"
                        >
                            <Image src="/github-65.svg" width={48} height={48} alt="" />
                        </a>
                    </div>
                </div>
            }
        </div>
    );
}