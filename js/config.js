// Supabase project connection
// ใช้ได้เฉพาะ Publishable/anon key เท่านั้น ห้ามใส่ service_role key
const SUPABASE_URL = "https://evaxqmwuugzsavphzbrp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YpilGly7oFyaIfJTasR01A_ODzPcSSh";

const configReady = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabaseClient = configReady
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
