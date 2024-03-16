"use client"

import { useState } from "react";
import {useTranslations, useLocale} from 'next-intl';
import { mainsplain } from "@/lib/openai";
import Image from 'next/image'

export default function Prompt() {
  const t = useTranslations("Prompt")
  const locale = useLocale();

  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onsubmit = async () => {
    setLoading(true)
    setResult(await mainsplain(input, locale));
    setLoading(false)
  }

  if (loading) {
    return <div>
      <h2>{t("onemoment")}...</h2><br />
      <Image
        src="/gubbe.gifv"
        width={500}
        height={500}
        alt="Picture of 'thinking bro'"
      />
    </div>
  }


  if (result) {
    return <div>
      <Image
        src="/bro-explaining.webp"
        width={500}
        height={300}
        alt="Picture of 'explaining bro'"
      />
      <br />
      <audio controls={true} autoPlay={true} src={result.voice} />
      <br />
      <button onClick={e => {
        e.preventDefault()
        setResult(null)
      }}>{t("askagain")}</button>
    </div>
  }

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        onsubmit()
      }}>
        <input
          style={{
            height: '2em',
            minWidth: '30em'
          }}
          placeholder={t("writehere")}
          defaultValue={input}
          onChange={(e) => {
            setInput(e.target?.value || "")
          }} />
        <button>{t("buttonsubmit")}</button>
      </form>
    </div>
  );
}
