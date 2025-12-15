import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, GraduationCap, ArrowLeft, University, MapPin, Calendar, Lock, MessageSquare, Bookmark } from "lucide-react";

const matriculaSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  whatsapp: z.string().min(10, "WhatsApp deve ter pelo menos 10 dígitos"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  instituicao: z.string().min(2, "Nome da instituição é obrigatório"),
  anoEscolar: z.string().min(1, "Ano escolar é obrigatório"),
  curso: z.string().min(2, "Nome do curso é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  motivacao: z.string().min(10, "Motivação deve ter pelo menos 10 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"]
});

type MatriculaForm = z.infer<typeof matriculaSchema>;

export default function Matricula() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const form = useForm<MatriculaForm>({
    resolver: zodResolver(matriculaSchema),
  });

  const onSubmit = async (data: MatriculaForm) => {
    setIsLoading(true);
    try {
      // 1. Create account  
      const result = await signUp(data.email, data.password, data.nome);

      if (result.error) throw result.error;

      // 2. Obter sessão (se existir) e garantir salvamento via Edge Function
      const { data: sessionData } = await supabase.auth.getSession();

      const targetUserId = sessionData.session?.user?.id || result.user?.id;
      if (!targetUserId) throw new Error('Não foi possível identificar o usuário criado.');

      const { error: fnError } = await supabase.functions.invoke('save_registration', {
        body: {
          user_id: targetUserId,
          full_name: data.nome,
          email: data.email,
          telefone: data.telefone,
          whatsapp: data.whatsapp,
          dataNascimento: data.dataNascimento,
          instituicao: data.instituicao,
          anoEscolar: data.anoEscolar,
          curso: data.curso,
          cidade: data.cidade,
          estado: data.estado,
          motivacao: data.motivacao,
        },
      });

      if (fnError) throw fnError;

      if (sessionData.session?.user) {
        toast({
          title: "Matrícula realizada com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu e-mail para confirmar a conta. Seus dados de matrícula já foram salvos.",
        });
        setTimeout(() => navigate('/auth'), 3000);
      }
    } catch (error: any) {
      console.error('Erro na matrícula:', error);
      toast({
        title: "Erro na matrícula",
        description: error.message || "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-foreground">METIS</h1>
          </div>
          <p className="text-muted-foreground">
            Complete sua matrícula e inicie sua jornada de aprendizado
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Matrícula do Curso</CardTitle>
            <CardDescription>
              Preencha seus dados completos para se matricular no curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Dados Pessoais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Nome Completo
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Digite seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            Telefone
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                       control={form.control}
                       name="whatsapp"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel className="flex items-center">
                             <MessageSquare className="w-4 h-4 mr-2" />
                             WhatsApp
                           </FormLabel>
                           <FormControl>
                             <Input placeholder="(11) 99999-9999" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />

                    <FormField
                      control={form.control}
                      name="dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Data de Nascimento
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Cidade
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Sua cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                       control={form.control}
                       name="estado"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel className="flex items-center">
                             <MapPin className="w-4 h-4 mr-2" />
                             Estado
                           </FormLabel>
                           <FormControl>
                             <Input placeholder="Seu estado" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                  </div>
                </div>

                {/* Dados Acadêmicos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Dados Acadêmicos</h3>
                  
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormField
                       control={form.control}
                       name="instituicao"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel className="flex items-center">
                             <University className="w-4 h-4 mr-2" />
                             Instituição de Ensino
                           </FormLabel>
                           <FormControl>
                             <Input placeholder="Nome da escola, universidade ou instituição" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={form.control}
                       name="anoEscolar"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel className="flex items-center">
                             <GraduationCap className="w-4 h-4 mr-2" />
                             Ano Escolar
                           </FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl>
                               <SelectTrigger>
                                 <SelectValue placeholder="Selecione o ano" />
                               </SelectTrigger>
                             </FormControl>
                             <SelectContent>
                               <SelectItem value="6ano">6º Ano</SelectItem>
                               <SelectItem value="7ano">7º Ano</SelectItem>
                               <SelectItem value="8ano">8º Ano</SelectItem>
                               <SelectItem value="9ano">9º Ano</SelectItem>
                               <SelectItem value="1medio">1º Ano - Ensino Médio</SelectItem>
                               <SelectItem value="2medio">2º Ano - Ensino Médio</SelectItem>
                               <SelectItem value="3medio">3º Ano - Ensino Médio</SelectItem>
                               <SelectItem value="superior">Ensino Superior</SelectItem>
                               <SelectItem value="pos">Pós-graduação</SelectItem>
                             </SelectContent>
                           </Select>
                           <FormMessage />
                         </FormItem>
                       )}
                     />

                     <FormField
                       control={form.control}
                       name="curso"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel className="flex items-center">
                             <Bookmark className="w-4 h-4 mr-2" />
                             Curso
                           </FormLabel>
                           <FormControl>
                             <Input placeholder="Curso que está estudando" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                   </div>
                </div>

                {/* Motivação */}
                <FormField
                  control={form.control}
                  name="motivacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Por que você tem interesse em energia renovável?
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Conte-nos sobre sua motivação para participar deste curso..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Senha */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Acesso à Plataforma</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Senha
                          </FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Crie uma senha" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                       control={form.control}
                       name="confirmPassword"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel className="flex items-center">
                             <Lock className="w-4 h-4 mr-2" />
                             Confirmar Senha
                           </FormLabel>
                           <FormControl>
                             <Input type="password" placeholder="Confirme sua senha" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processando..." : "Confirmar Matrícula"}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Faça login
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Course Info */}
        <Card className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Módulos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Vídeos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">Gratuito</div>
                <div className="text-sm text-muted-foreground">Acesso completo</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}