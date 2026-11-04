import { getCurrentAppUserId } from "@/src/api/auth/currentUser";
import { supabase } from "@/supabase/supabase";

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
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("messages")
    .select(messageSelect)
    .eq("sender_id", userId)
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
  return data ?? [];
}

export async function getConversations(): Promise<Conversation[]> {
  const userId = await getCurrentAppUserId();

  const [conversationsResult, appointmentsResult] = await Promise.all([
    supabase
      .rpc("get_conversations")
      .select(`${messageSelect}, doctors(id, full_name, avatar_url, specialty)`)
      .order("created_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("doctor_id, doctors(id, full_name, avatar_url, specialty)")
      .eq("user_id", userId),
  ]);

  if (conversationsResult.error) {
    throw new Error(`Failed to fetch conversations: ${conversationsResult.error.message}`);
  }
  if (appointmentsResult.error) {
    throw new Error(`Failed to fetch conversations: ${appointmentsResult.error.message}`);
  }

  const conversations = (conversationsResult.data ?? []) as unknown as Conversation[];
  const listedDoctorIds = new Set(conversations.map((conversation) => conversation.doctor_id));

  const newConversations: Conversation[] = [];
  for (const appointment of (appointmentsResult.data ?? []) as any[]) {
    if (!appointment.doctor_id || listedDoctorIds.has(appointment.doctor_id)) continue;
    listedDoctorIds.add(appointment.doctor_id);

    newConversations.push({
      id: `new-${appointment.doctor_id}`,
      created_at: "",
      sender_id: userId,
      doctor_id: appointment.doctor_id,
      content: "",
      is_read: true,
      sent_by: "user",
      doctors: appointment.doctors,
    });
  }

  return [...conversations, ...newConversations];
}

export async function sendMessage(doctorId: string, content: string): Promise<Message> {
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: userId,
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
  const userId = await getCurrentAppUserId();

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("sender_id", userId)
    .eq("doctor_id", doctorId)
    .eq("sent_by", "doctor")
    .eq("is_read", false);

  if (error) throw new Error(`Failed to mark as read: ${error.message}`);
}