import Image from "next/image";
import { ComboMenu } from "@/components/ComboMenu";
import { srcLangs,destLangs,writingStyles } from "@/utils/config";
import {fetchApiUsageCount} from "@/_lib/db/data";
export async function SideBar() {
    const apiUsageCount = await fetchApiUsageCount()
    return (
        // TODO: add collapse button
        <div className="bg-gray-800 flex flex-col gap-2 p-2 w-[400px]">
            <div className="text-xl font-bold border-b border-gray-500"> Settings </div>

            <ComboMenu name={"Source Language"} storageKey={"srcLang"} list={srcLangs}/>
            <ComboMenu name={"Destination Language"} storageKey={"destLang"} list={destLangs}/>
            <ComboMenu name={"Writing Style"} storageKey={"writingStyle"} list={writingStyles}/>

            <hr className="border-gray-500"/>

            <div className="flex flex-col my-2">
                <div className="flex flex-row justify-between">
                    <div className="font-bold">API Usage Count</div>
                    <div>{apiUsageCount}/100</div>
                </div>
                <div className=" bg-black rounded-full">
                    <div className="w-full bg-blue-600 rounded-full h-4"
                        style={{width: `${apiUsageCount * 100 / 100}%`}}
                    ></div>
                </div>
            </div>

            <hr className="border-gray-500"/>

            <div className="h-full my-2">
                <div className="font-bold">Introduction</div>
            </div>

            <hr className="border-gray-500"/>

            <a 
                target="_blank" 
                href={"https://github.com/MorDev74/polyglot-penman"}
                rel="noopener noreferrer"
            >
                <Image src="/github-65.svg" width={48} height={48} alt="" />
            </a>
        </div>
    );
}