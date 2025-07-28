import { Suspense } from "react";
import BlogManager from "./blog-manager";

export default function Page() {
  return (
    <Suspense>
      <BlogManager />
    </Suspense>
  );
}
