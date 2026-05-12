import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Using anon key for simple select

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  const email = "adoula136@gmail.com";
  console.log(`Checking profile for: ${email}...`);

  // First find the user ID from auth.users? Wait, anon key can't see auth.users easily.
  // But we can check the profiles table if we know the email (if it's in there).
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email);

  if (error) {
    console.error("Error fetching profile:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("No profile found in 'profiles' table for this email.");
    
    // Check if table even exists
    const { error: tableError } = await supabase.from("profiles").select("count").limit(1);
    if (tableError) {
       console.log("Table 'profiles' might NOT exist or is inaccessible:", tableError.message);
    }
  } else {
    console.log("Profile(s) found:", data);
  }
}

debug();
