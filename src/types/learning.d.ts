type FileCourseDetails = {
  title: string;
  description: string;
  level: "Beginner" | "Advanced" | null;
  thumbnail: File | null | string;
  document: File | null | string;
  content: string | null;
  status: "Draft" | "Published" | null;
  type: "pdf" | "article" | null;
};
