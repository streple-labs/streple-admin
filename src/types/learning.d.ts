type FileCourseDetails = {
  id?: string;
  title: string;
  description: string;
  level: "Beginner" | "Advanced" | null;
  thumbnail: File | null | string;
  document: File | null | string;
  content: string | null;
  status: "Draft" | "Published" | null;
  type: "pdf" | "article" | null;
};

type Course = {
  id: string;
  title: string;
  description: string;
  content: string;
  document: File | null;
  thumbnail: File | string | null;
  level: "Beginner" | "Advanced";
  type: "pdf" | "article";
  status: "Draft" | "Published";
  creatorId: string | null;
  createdAt: string;
  updatedAt: string;
};

type LearningResponse = {
  data: Course[];
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalCount: number;
  totalPages: number;
};
