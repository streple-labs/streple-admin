import { Metadata } from "next";
import { Suspense } from "react";
import BlogManager from "./blog-manager";

export const metadata: Metadata = {
  title: "Blog Manager",
  description: "Manage your blog posts",
};

export default function Page() {
  return (
    <Suspense>
      <BlogManager />
    </Suspense>
  );
}
