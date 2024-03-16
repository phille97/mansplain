"use client"

import { useState } from "react";


export const Prompt: React.FC<{
  complete: (input: string) => void
}> = ({
  complete,
}) => {
  const [input, setInput] = useState<string>("");

  const onsubmit = () => {
    complete(input)
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
