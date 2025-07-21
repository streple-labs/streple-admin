type BlogDataType = {
  title: string;
  tags: string[];
  thumbnail: File | null;
  metatitle: string;
  description: string;
  content: string;
  status: "draft" | "published" | null;
};
