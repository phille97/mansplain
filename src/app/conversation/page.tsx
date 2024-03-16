"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

import type { Experience } from "@/lib/domain";
import { getExperience, humanSay } from "@/lib/service";
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
  }, []);

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
      <h2>Stored state</h2>
      <pre>{JSON.stringify(exp, undefined, 2)}</pre>
      <h2>Last bot response</h2>
      <pre>{JSON.stringify(lastResponse, undefined, 2)}</pre>
      <div>
        <Prompt complete={async (stuff) => {
          setLastResponse(await humanSay(uid, stuff));
          await refreshExp()
        }} />
      </div>
    </div>
  );
}
