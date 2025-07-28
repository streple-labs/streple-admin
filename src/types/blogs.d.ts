type BlogDataType = {
  id?: string;
  schedule?: boolean;
  draft?: boolean;
  title: string;
  tags: string[];
  thumbnail: File | null | string;
  metatitle: string;
  description: string;
  content: string;
  status: "Draft" | "Published" | null;
  scheduleDate?: Date | string | null;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  metatitle: string;
  description: string;
  content: string;
  tags: string[];
  thumbnail: File | string | null;
  status: "Draft" | "Published" | null;
  scheduleDate?: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string | null;
  view: number;
};

type BlogsResponse = {
  currentPage: number;
  data: Blog[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalCount: number;
  totalPages: number;
};
