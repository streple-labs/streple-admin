import { Suspense } from "react";
import LearningHub from "./learning-hub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Learning Hub",
};

export default function Page() {
  return (
    <Suspense>
      <LearningHub />
    </Suspense>
  );
}
