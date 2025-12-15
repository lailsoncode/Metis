import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'student';
  avatar_url?: string;
  phone?: string;
  city?: string;
  state?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: any; user: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
    
    // If profile doesn't exist, create it automatically
    if (!data) {
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user) {
        const user = session.session.user;
        
        // Check for registration data to complete profile
        const { data: registrationData } = await supabase
          .from('student_registrations')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        const newProfile = {
          id: userId,
          full_name: registrationData?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || 'Usuário',
          email: user.email || '',
          role: (user.email === 'admin@conexaopalmeira.com' || user.email === 'lailson@oxentecode.com.br') ? 'admin' as const : 'student' as const,
          phone: registrationData?.phone,
          city: registrationData?.city,
          state: registrationData?.state,
          bio: registrationData?.motivation
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
          
        if (createError) {
          console.error('Erro ao criar perfil:', createError);
          return null;
        }
        
        return createdProfile;
      }
    } else {
      // Update existing profile with registration data if missing
      const { data: registrationData } = await supabase
        .from('student_registrations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (registrationData && (!data.city || !data.state || !data.phone)) {
        const updates: any = {};
        if (!data.city && registrationData.city) updates.city = registrationData.city;
        if (!data.state && registrationData.state) updates.state = registrationData.state;
        if (!data.phone && registrationData.phone) updates.phone = registrationData.phone;
        if (!data.bio && registrationData.motivation) updates.bio = registrationData.motivation;
        
        if (Object.keys(updates).length > 0) {
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
          
          return updatedProfile || data;
        }
      }
    }
    
    return data;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch with setTimeout to prevent deadlock
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao METIS",
      });
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu e-mail para confirmar a conta",
      });
    }

    return { data, error, user: data?.user };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Atualizar o estado local
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas",
      });
    }

    return { error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};