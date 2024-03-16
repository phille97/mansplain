import Link from 'next/link'
import {useTranslations} from 'next-intl';

import Prompt from "@/components/prompt";

export default function Index() {
  const t = useTranslations("Index")
  return (
    <div>
      <p>
        <Link href="/sv">
          Svenska
        </Link>
        |
        <Link href="/en">
          English
        </Link>
      </p>
      <h1>Manspl<span style={{ color: 'blue' }}>AI</span>n</h1>
      <Prompt />
      <p>{t("pleasedontspam")}</p>
    </div>
  );
}
