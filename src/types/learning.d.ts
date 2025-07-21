type FileCourseDetails = {
  title: string;
  description: string;
  level: "Beginner" | "Advanced" | null;
  thumbnail: File | null;
  document: File | null;
  content: string | null;
  status: "draft" | "published" | null;
  type: "pdf" | "article" | null;
};
