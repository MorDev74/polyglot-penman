"use client"

import React, { useState } from "react";
import { defaultPrompt, promptTooltip } from "@/utils/config";
import { useCompletion } from "ai/react";
import { useRouter } from "next/navigation";

function generatePrompt({srcLang, destLang, writingStyle, promptTemplate}
  :{srcLang:string, destLang:string, writingStyle:string, promptTemplate:string}) 
{
  const prompt:string = promptTemplate
    .replace(/{source language}/g, srcLang)
    .replace(/{destination language}/g, destLang)
    .replace(/{writing style}/g, writingStyle)

  let promptMessage = "";
  if (srcLang === destLang) {
    promptMessage = "Source and destination languages cannot be the same.";
  } else if (
    !/{source language}/.test(promptTemplate)
    || !/{destination language}/.test(promptTemplate)
    || !/{writing style}/.test(promptTemplate)
  ) {
    promptMessage = "Make sure to include the following in your prompt: {source language}, {destination language}, {writing style}, {essay}.";
  }
  return { prompt,promptMessage };
}

// TODO: handle error
interface ErrorProps {
  promptTemplate?: string;
  sourceLanguage?: string;
  srcEssay?: string;
  generate?: string;
}

export default function Home() {
  const [errorMessage, setErrorMessage] = useState<ErrorProps>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // TODO: add select llm menu
  let modelName="qwen/qwen-2-7b-instruct:free";
  // modelName="microsoft/phi-3-medium-128k-instruct:free";
  modelName="google/learnlm-1.5-pro-experimental:free";
  // modelName="mistralai/mistral-7b-instruct:free";

  const { completion, complete } = useCompletion({
    api: "/api/openrouter/completion",
    onResponse: (response: Response) => {
      void response;
    },
    onFinish: (prompt: string, completion: string) => {
      void prompt;
      void completion;
      setIsLoading(false);
      console.log("setIsLoading : false");
    },
    onError: (error: Error) => {
      console.error('An error occurred:', error)
    },
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const srcLang = localStorage.getItem("srcLang") as string;
      const destLang = localStorage.getItem("destLang") as string;
      const writingStyle = localStorage.getItem("writingStyle") as string;
      const promptTemplate = formData.get("promptTemplate") as string;
      const srcEssay = formData.get("src-essay") as string;
      const temperature = parseInt(formData.get("temperature") as string ?? "0");

      const { prompt, promptMessage } = generatePrompt({srcLang, destLang, writingStyle, promptTemplate});
      if (promptMessage) {
        setErrorMessage({ promptTemplate: promptMessage });
        return;
      }
      if (!srcEssay) {
        setErrorMessage({ srcEssay: "Please enter an essay to translate." });
        return;
      }

      setIsLoading(true);
      console.log("setIsLoading : true");
      await complete(srcEssay,{
        body: {
          system: prompt,
          modelName: modelName,
          temperature: temperature,
        }
      });

    } catch(error) {
      void error;
      setErrorMessage({ generate: "Error generating content. Please try again later." });
    }

    router.refresh();
  } // end onSubmit

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
          {errorMessage?.promptTemplate && <p className="text-lg text-red-500">{errorMessage?.promptTemplate}</p>}
        </div>

        <div className="flex-1 flex flex-col">
          <label className={labelStyle} >Source Language Essay</label>
          <textarea
            name="src-essay"
            placeholder="Enter your source essay here"
            className={textareaStyle}
          />
          {errorMessage?.sourceLanguage && <div className="text-lg text-red-600">{errorMessage?.sourceLanguage}</div>}
        </div>

        <button 
          type="submit"
          className={`bg-sky-800 text-white font-bold p-2 rounded-full ${isLoading? "": "hover:bg-sky-600"}`}
          disabled={isLoading}
        >Generate</button>

        <div className="flex-1 flex flex-col">
          <label className={labelStyle} >Destination Language Essay</label>
          <textarea
            name="gen-essay"
            value={completion}
            placeholder="Generated essay"
            className={textareaStyle}
            readOnly
          />
          {errorMessage?.generate && <div className="text-lg text-red-600">{errorMessage?.generate}</div>}
        </div>

      </form>

    </div>
  );
}
