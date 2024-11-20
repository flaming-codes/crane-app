import { createClient } from "@supabase/supabase-js";
import { ENV } from "../data/env";

export const api = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
