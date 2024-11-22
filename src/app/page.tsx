"use client"
import { useState } from "react";
import { defaultPrompt, promptTooltip } from "@/utils/config";
import { generate } from "@/app/actions";
import { readStreamableValue } from "ai/rsc";

function generatePrompt({srcLang, destLang, writingStyle, promptTemplate}
  :{srcLang:string, destLang:string, writingStyle:string, promptTemplate:string}) 
{
  const prompt:string = promptTemplate
    .replace(/{source language}/g, srcLang)
    .replace(/{destination language}/g, destLang)
    .replace(/{writing style}/g, writingStyle)

  // TODO: validation {srcLang} {destLang}...
  // const errorMessage = "Make sure in your prompt you include the following: {source language}, {destination language}, {writing style}";
  return prompt;
}

interface ErrorProps {
  promptTemplate?: string;
  sourceLanguage?: string;
  generate?: string;
}

export default function Home() {
  const [generation, setGeneration] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<ErrorProps>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneration("");
    setPending(true);
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const srcLang = localStorage.getItem("srcLang") as string;
      const destLang = localStorage.getItem("destLang") as string;
      const writingStyle = localStorage.getItem("writingStyle") as string;
      const promptTemplate = formData.get("promptTemplate") as string;
      const srcEssay = formData.get("src-essay") as string;

      const prompt = generatePrompt({srcLang, destLang, writingStyle, promptTemplate});
      const { output } = await generate(prompt,srcEssay);
      if (output) {
        for await (const chunk of readStreamableValue(output)) {
          setGeneration(`${chunk}`);
        }
      }
    } catch(error) {
      void error;
      setErrorMessage({
        generate: "Error generating content. Please try again later."
      });
    }

    setPending(false);
  }

  const labelStyle = "rounded-md py-1 px-3 text-white bg-black w-1/3"
  const textareaStyle = "rounded-md flex-1 p-2 resize-none";

  return (
    <div className="flex flex-col w-full py-24 bg-gray-900">

      <form 
        onSubmit={onSubmit}
        className="h-full mx-auto w-2/3 flex flex-col gap-4 text-black"
      >
        <div className="flex-1 flex flex-col">
          <label className={labelStyle} >Prompt Template</label>
          <textarea
            name="promptTemplate"
            defaultValue={defaultPrompt}
            title={promptTooltip}
            placeholder="Enter your prompt here"
            className={textareaStyle}
          />
          {errorMessage?.promptTemplate && <p className="text-red-500">{errorMessage?.promptTemplate}</p>}
        </div>

        <div className="flex-1 flex flex-col">
          <label className={labelStyle} >Source Language Essay</label>
          <textarea
            name="src-essay"
            placeholder="Enter your source essay here"
            className={textareaStyle}
          />
        </div>

        <button 
          type="submit"
          className="bg-sky-800 text-white font-bold p-2 rounded-full hover:bg-sky-600"
          disabled={pending}
        >Generate</button>

        <div className="flex-1 flex flex-col">
          <label className={labelStyle} >Destination Language Essay</label>
          <textarea
            name="gen-essay"
            value={generation}
            placeholder="Generated essay"
            className={textareaStyle}
            readOnly
          />
        </div>
      </form>

    </div>
  );
}
