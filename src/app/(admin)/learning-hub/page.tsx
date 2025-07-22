"use client";

import { Suspense } from "react";
import LearningHub from "./learning-hub";

export default function Page() {
  return (
    <Suspense>
      <LearningHub />
    </Suspense>
  );
}
