import { Suspense } from "react";
import EmailCenter from "./email-center";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Center",
  description: "Manage your emails and notifications",
};

export default function Page() {
  return (
    <Suspense>
      <EmailCenter key={Math.random()} />
    </Suspense>
  );
}
