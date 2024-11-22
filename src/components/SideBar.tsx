import Image from "next/image";
import { ComboMenu } from "@/components/ComboMenu";
import { srcLangs,destLangs,writingStyles } from "@/utils/config";
import {fetchApiUsageCount} from "@/_lib/db/data";
export async function SideBar() {
    const apiUsageCount = await fetchApiUsageCount()
    return (

        <div className="bg-gray-800 flex flex-col gap-2 p-2">
            <div className="text-xl font-bold border-b"> Settings </div>

            <ComboMenu name={"Source Language"} storageKey={"srcLang"} list={srcLangs}/>
            <ComboMenu name={"Destination Language"} storageKey={"destLang"} list={destLangs}/>
            <ComboMenu name={"Writing Style"} storageKey={"writingStyle"} list={writingStyles}/>

            <div className="border-t"> API Count </div>
            <div>{apiUsageCount}</div>

            {/* TODO delete later */}
            <div className="border-t h-full">  
                <div>Dev</div>
                <div>{`NODE_ENV : ${process.env.NODE_ENV}`}</div>
            </div>

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