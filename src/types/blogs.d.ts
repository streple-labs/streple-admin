type BlogDataType = {
  title: string;
  tags: string[];
  thumbnail: File | null | string;
  metatitle: string;
  description: string;
  blog: string;
  status: "draft" | "published" | null;
};
