"use client"
import { useState } from "react";
import { defaultPrompt, promptTooltip } from "@/utils/config";
import { generate } from "@/app/actions";
import { readStreamableValue } from "ai/rsc";
import { useRouter } from "next/navigation";

function generatePrompt({srcLang, destLang, writingStyle, promptTemplate}
  :{srcLang:string, destLang:string, writingStyle:string, promptTemplate:string}) 
{
  const prompt:string = promptTemplate
    .replace(/{source language}/g, srcLang)
    .replace(/{destination language}/g, destLang)
    .replace(/{}/g, writingStyle)

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
  const [generation, setGeneration] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<ErrorProps>({});
  const [pending, setPending] = useState(false);
  const router = useRouter();

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

      const { prompt, promptMessage } = generatePrompt({srcLang, destLang, writingStyle, promptTemplate});
      if (promptMessage) {
        setErrorMessage({ promptTemplate: promptMessage });
        setPending(false);
        return;
      }
      if (!srcEssay) {
        setErrorMessage({ srcEssay: "Please enter an essay to translate." });
        setPending(false);
        return;
      }

      const { output,message } = await generate(prompt,srcEssay);
      if (output) {
        for await (const chunk of readStreamableValue(output)) {
          setGeneration(`${chunk}`);
        }
      }
      if (message) {
        setErrorMessage({ generate: message });
      }

    } catch(error) {
      void error;
      setErrorMessage({ generate: "Error generating content. Please try again later." });
    }

    router.refresh();
    setPending(false);
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
          className={`bg-sky-800 text-white font-bold p-2 rounded-full ${pending? "": "hover:bg-sky-600"}`}
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
          {errorMessage?.generate && <div className="text-lg text-red-600">{errorMessage?.generate}</div>}
        </div>
      </form>

    </div>
  );
}
