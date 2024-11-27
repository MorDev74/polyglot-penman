"use client"
import { useEffect,useState } from "react";

interface RangeSliderProps {
    storageKey: string;
    initValue: string;
    minValue: string;
    maxValue: string;
    step: number;
}

export function RangeSlider(props: RangeSliderProps) {
    const { storageKey,initValue, minValue, maxValue, step } = props;
    const [ sliderValue, setSliderValue ] = useState(initValue);

    useEffect(() => {
        const storageValue = localStorage.getItem(storageKey) as string;
        if (storageValue !== null) {
            setSliderValue(storageValue);
        } else {
            localStorage.setItem(storageKey, minValue);
        }
    },[storageKey,minValue])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSliderValue(e.target.value);
        localStorage.setItem(storageKey, e.target.value);
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="font-bold">Temperature</div>
                <div>{sliderValue}</div>
            </div>
            <input
                type={"range"}
                min={minValue}
                max={maxValue}
                value={sliderValue}
                step={step}
                onChange={handleChange}
                className="w-full cursor-pointer
                    accent-sky-600
                "
            />
        </div>
    );
}