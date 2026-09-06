import { supabase } from "@/supabase/supabase";
import { setDemoSession } from "@/src/api/auth/demoSession";

const messageSelect = `
  id,
  created_at,
  sender_id,
  doctor_id,
  content,
  is_read,
  sent_by
`;

export type Message = {
  id: string;
  created_at: string;
  sender_id: string;
  doctor_id: string;
  content: string;
  is_read: boolean;
  sent_by: "user" | "doctor";
};

export type Conversation = Message & {
  doctors: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    specialty: string | null;
  };
};

export async function getMessages(doctorId: string): Promise<Message[]> {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const { data, error } = await supabase
    .from("messages")
    .select(messageSelect)
    .eq("sender_id", user.id)
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
  return data ?? [];
}

export async function getConversations(): Promise<Conversation[]> {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const { data, error } = await supabase
    .from("messages")
    .select(`${messageSelect}, doctors(id, full_name, avatar_url, specialty)`)
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch conversations: ${error.message}`);
  return (data ?? []) as Conversation[];
}

export async function sendMessage(doctorId: string, content: string): Promise<Message> {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.id,
      doctor_id: doctorId,
      content,
      sent_by: "user",
    })
    .select(messageSelect)
    .single();

  if (error) throw new Error(`Failed to send message: ${error.message}`);
  return data as Message;
}

export async function markAsRead(doctorId: string): Promise<void> {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("sender_id", user.id)
    .eq("doctor_id", doctorId)
    .eq("sent_by", "doctor")
    .eq("is_read", false);

  if (error) throw new Error(`Failed to mark as read: ${error.message}`);
}