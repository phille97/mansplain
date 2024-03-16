"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

import type { Experience } from "@/lib/domain";
import { getExperience, humanSay, reset } from "@/lib/service";
import { Prompt } from "@/components/prompt";

export default function Conversation() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [exp, setExp] = useState<Experience | null>(null)

  const uid = searchParams.get("uid")

  const refreshExp = async () => {
    if (!uid) {return;}
    setLoading(true)
    setExp(await getExperience(uid))
    setLoading(false)
  }
  useEffect(() => {
    refreshExp()
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div>
        <p>Fetching EXP...</p>
      </div>
    )
  }

  if (!uid || !exp) {
    return (
      <div>
        <p>:(</p>
      </div>
    )
  }

  return (
    <div>
      <p><strong>UID:</strong> {exp.uid}</p>
      <p><strong>History:</strong></p>
      <div>
        {exp.previousCalls.map(callSummary => (
          <div key={callSummary.eid} style={{
            border: '1px solid gray',
            marginBottom: '1em',
            padding: '0 .75em'
          }}>
            <p>
              <small>{callSummary.eid} <strong>/</strong> {(new Date(callSummary.when)).toISOString()}</small>
            </p>
            <p><strong>Summary:</strong> {callSummary.summary}</p>
            <p>
              <strong>Log:</strong>
              <table>
                {callSummary.call.log.map((entry, i) => (
                  <tr key={i}><td style={{
                    color: entry.who === "bot" ? 'blue' : 'orange'
                  }}><strong>{entry.who}</strong></td><td>{entry.text}</td></tr>
                ))}
              </table>
            </p>
          </div>
        ))}
      </div>
      {exp.currentCall ? (
        <div>
          <p style={{ color: 'green' }}>Ongoing call</p>
          <p>
            <table>
              {exp.currentCall.log.map((entry, i) => (
                <tr key={i}><td style={{
                  color: entry.who === "bot" ? 'blue' : 'orange'
                }}><strong>{entry.who}</strong></td><td>{entry.text}</td></tr>
              ))}
            </table>
          </p>
        </div>
      ) : (<p style={{ color: 'red' }}>No ongoing call</p>)}
      <pre>{JSON.stringify(lastResponse, undefined, 2)}</pre>
      <div>
        <Prompt complete={async (stuff) => {
          setLoading(true);
          setLastResponse(await humanSay(uid, null, stuff));
          setLoading(false);
          await refreshExp()
        }} />
      </div>
      <div><button onClick={async () => {
        await reset(uid);
        await refreshExp();
      }}>Reset</button></div>
    </div>
  );
}
