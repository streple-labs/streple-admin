import { Metadata } from "next";
import Protraders from "./protraders";

export const metadata: Metadata = {
  title: "ProTraders",
  description: "ProTraders Dashboard",
};

export default function page() {
  return <Protraders />;
}
