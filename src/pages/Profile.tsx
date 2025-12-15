import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, FileText, Save } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  bio?: string;
  avatar_url?: string;
}

export default function Profile() {
  const { user, profile, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    bio: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        city: profile.city || '',
        state: profile.state || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          city: profileData.city,
          state: profileData.state,
          bio: profileData.bio
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Refresh profile data
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e dados para certificados
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Foto do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {profileData.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button variant="outline" className="w-full" disabled>
                <FileText className="w-4 h-4 mr-2" />
                Alterar Foto
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Funcionalidade em desenvolvimento
              </p>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                <CardDescription>
                  Dados utilizados para emissão de certificados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome Completo *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        placeholder="Seu nome completo"
                        value={profileData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="pl-10 bg-muted"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      O e-mail não pode ser alterado
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="(00) 00000-0000"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="state"
                        placeholder="Ex: Paraíba"
                        value={profileData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">Cidade</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="Ex: João Pessoa"
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    placeholder="Conte um pouco sobre você..."
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Course Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas de Aprendizado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <p className="text-sm text-muted-foreground">Cursos Concluídos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">0</div>
                    <p className="text-sm text-muted-foreground">Certificados</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">0h</div>
                    <p className="text-sm text-muted-foreground">Tempo de Estudo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}