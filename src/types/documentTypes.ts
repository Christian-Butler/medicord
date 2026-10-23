// Matches the check constraint on documents.category in Supabase.
export const DOCUMENT_CATEGORIES = ["prescription", "lab_result", "referral", "other"] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

// Matches the bucket's allowed_mime_types and file_size_limit.
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/heic"];
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

export type MedicalDocument = {
  id: string;
  user_id: string;
  doctor_id: string | null;
  title: string;
  category: DocumentCategory;
  file_path: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  doctors: { full_name: string } | null;
};

// What the file picker gives us, plus the category the user chose.
export type DocumentUploadInput = {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
  category: DocumentCategory;
};