"use client"

import { useState } from "react";
import { mainsplain } from "@/lib/openai";
import Image from 'next/image'

export default function Prompt() {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onsubmit = async () => {
    setLoading(true)
    setResult(await mainsplain(input, "sv"));
    setLoading(false)
  }

  if (loading) {
    return <div>
      <h2>Bufferi bufferi bufferi...</h2><br />
    </div>
  }


  if (result) {
    return <div>
      <p style={{
        maxWidth: '300px',
      }}>
        {result.text}
      </p>
      <br />
      <button onClick={e => {
        e.preventDefault()
        setResult(null)
      }}>Fråga igen</button>
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
          placeholder={"Skriv här"}
          defaultValue={input}
          onChange={(e) => {
            setInput(e.target?.value || "")
          }} />
        <button>Skicka</button>
      </form>
    </div>
  );
}
