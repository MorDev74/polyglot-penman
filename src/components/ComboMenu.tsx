"use client"

import React, { useEffect, useState } from "react";

export function ComboMenu({name,storageKey,list}
        :{name:string,storageKey:string,list:string[]}) {
    const [selectValue, setSelectValue] = useState("");

    useEffect(() => {
        try {
            const storageValue = localStorage.getItem(storageKey) as string;
            setSelectValue(storageValue);
        } catch(error) {
            void error;
            setSelectValue(list[0]);
            localStorage.setItem(storageKey,list[0]);
        }
    },[list,storageKey]);

    function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        e.preventDefault();
        localStorage.setItem(storageKey, e.target.value);
        setSelectValue(e.target.value);
    }

    return (
        <div className="flex flex-col">
            <div>{name}</div>

            <select 
                value={selectValue}
                onChange={onSelectChange}
                className="rounded-md bg-slate-900 p-1"
            >
                {list.map((item,index) => (
                    <option
                        key={index}
                        className="bg-black 
                            hover:bg-blue-700"
                        value={item}
                    >
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}