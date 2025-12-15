// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    console.log("save_registration: incoming body", body);

    const {
      user_id,
      full_name,
      email,
      telefone,
      whatsapp,
      dataNascimento,
      instituicao,
      anoEscolar,
      curso,
      cidade,
      estado,
      motivacao,
    } = body;

    if (!user_id || !email) {
      return new Response(
        JSON.stringify({ error: "user_id e email são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Configuração do Supabase ausente");
      return new Response(
        JSON.stringify({ error: "Configuração do Supabase ausente" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // 1) Upsert em student_registrations
    const { error: regError } = await supabaseAdmin
      .from("student_registrations")
      .upsert(
        {
          user_id,
          full_name,
          email,
          phone: telefone,
          whatsapp,
          birth_date: dataNascimento,
          institution_name: instituicao,
          school_year: anoEscolar,
          course_name: curso,
          city: cidade,
          state: estado,
          motivation: motivacao,
        },
        { onConflict: "user_id" }
      );

    if (regError) {
      console.error("Erro ao salvar student_registrations:", regError);
      return new Response(
        JSON.stringify({ error: regError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2) Upsert/merge em profiles
    const { data: existingProfile, error: profileFetchError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .maybeSingle();

    if (profileFetchError) {
      console.error("Erro ao buscar profile:", profileFetchError);
      return new Response(
        JSON.stringify({ error: profileFetchError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingProfile) {
      const updates: Record<string, any> = {};
      if (full_name && existingProfile.full_name !== full_name) updates.full_name = full_name;
      if (cidade && existingProfile.city !== cidade) updates.city = cidade;
      if (estado && existingProfile.state !== estado) updates.state = estado;
      if (telefone && existingProfile.phone !== telefone) updates.phone = telefone;
      if (motivacao && existingProfile.bio !== motivacao) updates.bio = motivacao;

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update(updates)
          .eq("id", user_id);

        if (updateError) {
          console.error("Erro ao atualizar profile:", updateError);
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    } else {
      const { error: insertProfileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: user_id,
          full_name: full_name || "Usuário",
          email,
          role: "student",
          phone: telefone,
          city: cidade,
          state: estado,
          bio: motivacao,
        });

      if (insertProfileError) {
        console.error("Erro ao inserir profile:", insertProfileError);
        return new Response(
          JSON.stringify({ error: insertProfileError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Erro inesperado:", e);
    return new Response(
      JSON.stringify({ error: "Erro inesperado" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
