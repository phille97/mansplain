import { type NextRequest, NextResponse } from 'next/server'
import Twilio from 'twilio'

import { getExperience, humanSay } from "@/lib/service";

const twilioLocale = "en-GB";
const twilioVoice = "Google.en-GB-Standard-D";


const xmlResponse = (xml: string) : NextResponse => {
  const resp = new NextResponse(xml)
  resp.headers.set("Content-Type", "application/xml")
  return resp
}

const errorResponse = (statusCode: number, what: string) : NextResponse => {
  return new NextResponse(what, { status: statusCode })
}

async function handler(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams
  const uid = searchParams.get('Caller')
  if (!uid) {
    return errorResponse(400, "no Caller")
  }

  const callsid = searchParams.get('CallSid')
  if (!callsid) {
    return errorResponse(400, "no CallSid")
  }

  let speechInput = searchParams.get('SpeechResult');
  if (req.method === 'POST') {
    const formData = await req.formData()
    const formDataInput = formData.get("SpeechResult")
    speechInput = formDataInput ? formDataInput.toString() : speechInput
  }

  const exp = await getExperience(uid)

  let speechOutput = "Welcome"
  if (exp.previousCalls && exp.previousCalls.length > 0) {
    speechOutput += ", what do you want this time?"
  } else {
    speechOutput += " to the mansplain bot. Ask your question now."
  }

  type patchFunc = (x: any) => void
  let afterBotResponse: patchFunc[] = []

  if (speechInput) {
    const botResponse = await humanSay(uid, callsid, speechInput)

    const hangup = botResponse.commands.indexOf("HANGUP") !== -1

    if (botResponse.commands.indexOf("HAHA") !== -1) {
      afterBotResponse.push((t: any) => {
        t.play("https://github.com/phille97/mansplain/raw/main/public/hehe-effect.mp3")
      })
    }
    if (botResponse.commands.indexOf("SIGH") !== -1) {
      afterBotResponse.push((t: any) => {
        t.play("https://github.com/phille97/mansplain/raw/main/public/sigh-effect.mp3")
      })
    }

    speechOutput = botResponse.text;

    if (hangup) {
      let twiml = new Twilio.twiml.VoiceResponse();

      twiml.say({
        language: twilioLocale,
        voice: twilioVoice
      }, speechOutput);

      for (let patch of afterBotResponse) {
        patch(twiml)
      }

      return xmlResponse(twiml.toString())
    }
  }

  let twiml = new Twilio.twiml.VoiceResponse();

  const g = twiml.gather({
    input: ['speech'],
    speechTimeout: 'auto',
    language: twilioLocale
  });

  g.say({
    language: twilioLocale,
    voice: twilioVoice
  }, speechOutput);

  for (let patch of afterBotResponse) {
    patch(g)
  }

  twiml.say({
    language: twilioLocale,
    voice: twilioVoice
  },'Ok bye');

  return xmlResponse(twiml.toString())
}


export const GET = handler
export const POST = handler