import { Open_Sans, Anton, Roboto } from "next/font/google";

export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
