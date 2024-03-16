import { Suspense } from 'react'

import Conversation from "@/components/conversation";

export default function ConversationPage() {

  return (
    <Suspense>
      <Conversation />
    </Suspense>
  );
}
