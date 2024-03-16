import { type NextRequest, NextResponse } from 'next/server'
import Twilio from 'twilio'

import { getExperience, humanSay } from "@/lib/service";

const twilioLocale = "en-GB";
const twilioVoice = "Google.en-GB-Standard-D";

async function handler(
  req: NextRequest,
) {
  const searchParams = req.nextUrl.searchParams
  const uid = searchParams.get('Caller')
  if (!uid) {
    throw new Error("no Caller")
  }

  const callsid = searchParams.get('CallSid')
  if (!callsid) {
    throw new Error("no CallSid")
  }

  let speechInput = searchParams.get('SpeechResult');
  if (req.method === 'POST') {
    const formData = await req.formData()
    const formDataInput = formData.get("SpeechResult")
    speechInput = formDataInput ? formDataInput.toString() : speechInput
  }

  const exp = await getExperience(uid)

  if (speechInput) {
    const botResponse = await humanSay(uid, callsid, speechInput)

    const hangup = botResponse.commands.indexOf("HANGUP") !== -1
    const haha = botResponse.commands.indexOf("HAHA") !== -1
    const sigh = botResponse.commands.indexOf("SIGH") !== -1

    if (!hangup) {
      let twiml = new Twilio.twiml.VoiceResponse();

      const g = twiml.gather({
        input: ['speech'],
        speechTimeout: 'auto',
        language: twilioLocale
      });
      g.say({
        language: twilioLocale,
        voice: twilioVoice
      }, botResponse.text);

      if (haha) {
        g.play("https://github.com/phille97/mansplain/raw/main/public/haha-effect.mp3");
      }
      if (sigh) {
        g.play("https://github.com/phille97/mansplain/raw/main/public/sigh-effect.mp3");
      }

      twiml.say({
        language: twilioLocale,
        voice: twilioVoice
      },'Ok bye');

      const resp = new NextResponse(twiml.toString())
      resp.headers.set("Content-Type", "application/xml")
      return resp
    } else {
      let twiml = new Twilio.twiml.VoiceResponse();

      twiml.say({
        language: twilioLocale,
        voice: twilioVoice
      }, botResponse.text);

      if (haha) {
        twiml.play("https://github.com/phille97/mansplain/raw/main/public/haha-effect.mp3");
      }
      if (sigh) {
        twiml.play("https://github.com/phille97/mansplain/raw/main/public/sigh-effect.mp3");
      }

      const resp = new NextResponse(twiml.toString())
      resp.headers.set("Content-Type", "application/xml")
      return resp
    }
  }

  let twiml = new Twilio.twiml.VoiceResponse();
  const g = twiml.gather({
    input: ['speech'],
    speechTimeout: 'auto',
    language: twilioLocale
  });

  let p = "Welcome"
  if (exp.previousCalls) {
    p += ", what do you want this time?"
  } else {
    p += " to the mansplain bot. Ask your question now."
  }
  g.say({
    language: twilioLocale,
    voice: twilioVoice
  }, p);

  twiml.say({
    language: twilioLocale,
    voice: twilioVoice
  },'Ok bye');

  const resp = new NextResponse(twiml.toString())
  resp.headers.set("Content-Type", "application/xml")
  return resp
}


export const GET = handler
export const POST = handler