type FileCourseDetails = {
  title: string;
  description: string;
  track: "Beginner" | "Advanced" | null;
  cover_img: File | null;
  file: File | null;
  article: string | null;
  status: "Draft" | "Published" | null;
};
