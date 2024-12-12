export const srcLangs = [
    "en-US",
    "en-GB",
    "zh-CN",
    "es-ES",
    "fr-FR",
    "de-DE",
    "ja-JP",
    "pt-BR",
    "ru-RU",
    "it-IT"
];

export const destLangs = [
    "en-US",
    "en-GB",
    "zh-CN",
    "es-ES",
    "fr-FR",
    "de-DE",
    "ja-JP",
    "pt-BR",
    "ru-RU",
    "it-IT"
];

export const writingStyles = [
    "Formal",
    "Business",
    "Informal",
    "Descriptive",
    "Narrative",
    "Expository",
    "Argumentative",
    "Creative",
    "Satirical",
    "Technical"
]

export const llmNames = [
  "qwen/qwen-2-7b-instruct:free",
  "microsoft/phi-3-medium-128k-instruct:free",
  "google/learnlm-1.5-pro-experimental:free",
  "mistralai/mistral-7b-instruct:free",
]

export const defaultPrompt = `Translate the given essay from {source language} to {destination language}, and employ a {writing style} writing style.
essay:
`;

// export const defaultPrompt = `You are a {destination language} writing teacher, 
// i will provide you a {source language} essay, 
// and you will translate it to {destination language} use a {writing style} style. 
// Your task is to translate the essay accurately, maintaining the original meaning, structure, and length. 
// Do not add any extra information or expand on the content. 
// Additionally, please provide feedback on any areas where my essay could be improved. 
// essay: {essay}`;

export const promptTooltip = "Make sure to include the following in your prompt: {source language}, {destination language}, {writing style}, {essay}."