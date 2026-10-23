import { getCurrentAppUserId } from "@/src/api/auth/currentUser";
import {
  ALLOWED_DOCUMENT_TYPES,
  MAX_DOCUMENT_BYTES,
  type DocumentUploadInput,
  type MedicalDocument,
} from "@/src/types/documentTypes";
import { supabase } from "@/supabase/supabase";

const BUCKET = "documents";

// Only the columns the screens use, plus the doctor's name for documents a doctor sent.
const documentSelect = `
  id,
  user_id,
  doctor_id,
  title,
  category,
  file_path,
  mime_type,
  size_bytes,
  created_at,
  doctors(full_name)
`;

const EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
};

// "Blood test March.pdf" -> "Blood test March"
function titleFromFileName(name: string): string {
  const withoutExtension = name.replace(/\.[^.]+$/, "").trim();
  return withoutExtension || "Untitled document";
}

export async function getMyDocuments(): Promise<MedicalDocument[]> {
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("documents")
    .select(documentSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as unknown as MedicalDocument[];
}

export async function getLatestDocument(): Promise<MedicalDocument | null> {
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("documents")
    .select(documentSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data as unknown as MedicalDocument | null;
}

export async function uploadDocument(input: DocumentUploadInput): Promise<MedicalDocument> {
  // Same limits as the bucket, checked here first so the user gets a clear message instead of a storage error.
  if (!ALLOWED_DOCUMENT_TYPES.includes(input.mimeType)) {
    throw new Error("Only PDFs and photos (JPG, PNG, HEIC) can be added.");
  }
  if (input.size > MAX_DOCUMENT_BYTES) {
    throw new Error("That file is over 10 MB. Try a smaller scan or photo.");
  }

  const userId = await getCurrentAppUserId();
  // The first folder must be the user's ID, or the storage policy rejects it.
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${EXTENSIONS[input.mimeType]}`;
  const path = `${userId}/${fileName}`;

  const formData = new FormData();
  formData.append("file", { uri: input.uri, name: fileName, type: input.mimeType } as any);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, formData, { contentType: input.mimeType });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      title: titleFromFileName(input.name),
      category: input.category,
      file_path: path,
      mime_type: input.mimeType,
      size_bytes: input.size,
    })
    .select(documentSelect)
    .single();

  // If the row couldn't be saved, don't leave an orphaned file sitting in storage.
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw error;
  }

  return data as unknown as MedicalDocument;
}

export async function deleteDocument(document: MedicalDocument): Promise<void> {
  const userId = await getCurrentAppUserId();

  // Row first: once it's gone the document disappears for the user, even if the file cleanup below fails.
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", document.id)
    .eq("user_id", userId);

  if (error) throw error;

  await supabase.storage.from(BUCKET).remove([document.file_path]);
}

// A temporary link to the private file, only created when the user taps to open or share it.
export async function getDocumentUrl(document: MedicalDocument, expiresInSeconds = 60): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(document.file_path, expiresInSeconds);

  if (error || !data) throw error ?? new Error("Couldn't open this document.");

  return data.signedUrl;
}