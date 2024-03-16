"use server";

import openai from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3Bucket = "lillagumman";
const s3BucketRegion = process.env.S3_UPLOAD_REGION || "eu-north-1";
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_UPLOAD_SECRET_ACCESS_KEY || "",
  },
  region: s3BucketRegion,
})


const uploads3 = async (name: string, data: Response) => {
  const buffer = Buffer.from(await (await data.blob()).arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: s3Bucket,
    Key: name,
    Body: buffer,
  });

  try {
    await s3.send(command);
    return "https://"+s3Bucket+".s3."+s3BucketRegion+".amazonaws.com/" + name
  } catch (err) {
    console.log(err)
    return false
  }
}

const openaiInstance = new openai.OpenAI({
	apiKey: process.env.OPENAI_API_KEY || ""
});

const mainsplain = async (question: string, locale: string) => {
  let prompt = 'Skriv en kort en rads paragraf, mansplainat för mig på ett nedlåtande sätt samt börja meningen med "Lilla gumman": '
  let sanitizedLocale = 'sv'

  if (locale === "en") {
    prompt = 'Write a short one-line paragraph, mansplained to me in a condescending way and start the sentence with "Listen sweetie": '
    sanitizedLocale = 'en'
  }

	const textReply = await openaiInstance.chat.completions.create({
		messages: [
      {
        role: 'user',
        content: prompt + question
      }
    ],
		model: 'gpt-3.5-turbo',
	});

  const mainsplained = textReply.choices[0].message.content

  if (!mainsplained) {
    return { success: false }
  }

  const voiceReply = await openaiInstance.audio.speech.create({
    input: mainsplained,
    model: 'tts-1',
    voice: 'onyx',
    response_format: 'mp3'
  })
  const now = new Date();
  const fileName = `${now.getFullYear()}/${now.getMonth()}/${now.getDate()}/${sanitizedLocale}/${randomUUID()}.mp3`

  return {
    success: true,
    text: mainsplained,
    voice: await uploads3(fileName, voiceReply),
  }
}

export {
	mainsplain,
};
