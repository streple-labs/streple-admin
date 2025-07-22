type Recipient = "All users" | "Copiers" | "Protraders";

type EmailType = {
  schedule: boolean;
  draft: boolean;
  subject: string;
  message: string;
  recipient: Recipient;
  selected: string[];
  scheduleDate: Date | string | null;
};

type Email = {
  id: string;
  subject: string;
  message: string;
  recipient: Recipient;
  selected: string[];
  scheduleDate: Date | string | null;
  createdAt: string;
  updatedAt: string;
  clickRate: string;
  openRate: string;
};

type EmailResponse = {
  data: Email[];
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalCount: number;
  totalPages: number;
};
