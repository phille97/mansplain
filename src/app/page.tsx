import Link from 'next/link'
import { randomUUID } from "crypto";


export default function Index() {
  return (
    <div>
      <Link href={`/conversation?uid=${randomUUID()}`}>
        Starta ny konversation
      </Link>
    </div>
  );
}