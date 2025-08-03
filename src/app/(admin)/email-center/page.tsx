import { Suspense } from "react";
import EmailCenter from "./email-center";

export default function Page() {
  return (
    <Suspense>
      <EmailCenter key={Math.random()} />
    </Suspense>
  );
}
