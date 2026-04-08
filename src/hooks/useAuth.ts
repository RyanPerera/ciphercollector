import { useState, useEffect } from "react";
import supabase from "../supabase";

interface User {
  user_metadata?: {
    full_name?: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [uid, setUid] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      if (data.session?.user) {
        setUid(data.session.user.id);
      }
      setIsLoading(false);
    }

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setUid(session.user.id);
      } else {
        setUid("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, uid, isLoading };
}
