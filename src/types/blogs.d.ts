type BlogDataType = {
  id?: string;
  schedule?: boolean;
  title: string;
  tags: string[];
  thumbnail: File | null | string;
  metatitle: string;
  description: string;
  content: string;
  status: "draft" | "published" | "Draft" | "Published" | null;
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
  status: "draft" | "published" | "Draft" | "Published" | null;
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
  totalCount: 1;
  totalPages: 1;
};
