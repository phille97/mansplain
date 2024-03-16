"use server";

import openai from "openai";
import { randomUUID, createHash } from "crypto";

// import {uploadToS3} from "./s3";
import {set, get} from "./db";


const openaiInstance = new openai.OpenAI({
	apiKey: process.env.OPENAI_API_KEY || ""
});


export const aiprompt = async (prompt: string) : Promise<string | null> => {
	const textReply = await openaiInstance.chat.completions.create({
		messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
		model: 'gpt-3.5-turbo',
    //model: 'gpt-4',
	});

  return textReply.choices[0].message.content
}

const mainsplain = async (question: string, locale: string) : Promise<{success: true, text: string} | {success: false}> => {
  let prompt = 'Skriv en kort en rads paragraf, mansplainat för mig på ett nedlåtande sätt samt börja meningen med "Lilla gumman": ' + question
  let sanitizedLocale = 'sv'

  const mainsplained = await aiprompt(prompt)

  if (!mainsplained) {
    return { success: false }
  }

  const questionHash = "question:"+createHash('sha256').update(`${locale}_${question}`).digest('base64');

  await set(questionHash, {
    "prompt": prompt,
    "anwser": mainsplained,
  });

  //const voiceReply = await openaiInstance.audio.speech.create({
  //  input: mainsplained,
  //  model: 'tts-1',
  //  voice: 'onyx',
  //  response_format: 'mp3'
  //})
  //const now = new Date();
  //const fileName = `${now.getFullYear()}/${now.getMonth()}/${now.getDate()}/${sanitizedLocale}/${randomUUID()}.mp3`

  //const voiceFile = await uploadToS3(fileName, voiceReply)

  //if (!voiceFile) {
  //  return { success: false }
  //}

  //await set(questionHash + ":voiceFile", voiceFile);

  return {
    success: true,
    text: mainsplained,
    //voice: voiceFile,
  }
}

export {
	mainsplain,
};
