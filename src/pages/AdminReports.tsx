import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, School, MapPin, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";

interface StudentRegistration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  birth_date: string;
  institution_name: string;
  school_year: string;
  course_name: string;
  city: string;
  state: string;
  motivation: string;
  registration_date: string;
}

interface DashboardMetrics {
  totalRegistrations: number;
  averageAge: number;
  topInstitutions: Array<{name: string; count: number}>;
  ageDistribution: Array<{range: string; count: number}>;
  monthlyRegistrations: Array<{month: string; count: number}>;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function AdminReports() {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<StudentRegistration[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRegistrations: 0,
    averageAge: 0,
    topInstitutions: [],
    ageDistribution: [],
    monthlyRegistrations: []
  });
  const [filters, setFilters] = useState({
    search: "",
    institution: "",
    schoolYear: "",
    city: "",
    state: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Adicionar auto-refresh dos dados a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(fetchRegistrations, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [registrations, filters]);

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('student_registrations')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error) throw error;

      setRegistrations(data || []);
      calculateMetrics(data || []);
    } catch (error) {
      console.error('Erro ao buscar matrículas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (data: StudentRegistration[]) => {
    const totalRegistrations = data.length;
    
    // Calculate average age
    const ages = data
      .filter(reg => reg.birth_date)
      .map(reg => {
        const birthDate = new Date(reg.birth_date);
        const today = new Date();
        return today.getFullYear() - birthDate.getFullYear();
      });
    const averageAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

    // Top institutions
    const institutionCounts = data.reduce((acc, reg) => {
      acc[reg.institution_name] = (acc[reg.institution_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topInstitutions = Object.entries(institutionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Age distribution
    const ageRanges = { '13-15': 0, '16-18': 0, '19-22': 0, '23+': 0 };
    ages.forEach(age => {
      if (age >= 13 && age <= 15) ageRanges['13-15']++;
      else if (age >= 16 && age <= 18) ageRanges['16-18']++;
      else if (age >= 19 && age <= 22) ageRanges['19-22']++;
      else if (age >= 23) ageRanges['23+']++;
    });
    
    const ageDistribution = Object.entries(ageRanges).map(([range, count]) => ({ range, count }));

    // Monthly registrations
    const monthlyData = data.reduce((acc, reg) => {
      const month = new Date(reg.registration_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyRegistrations = Object.entries(monthlyData)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-6)
      .map(([month, count]) => ({ month, count }));

    setMetrics({
      totalRegistrations,
      averageAge,
      topInstitutions,
      ageDistribution,
      monthlyRegistrations
    });
  };

  const applyFilters = () => {
    let filtered = registrations;

    if (filters.search) {
      filtered = filtered.filter(reg => 
        reg.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        reg.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        reg.institution_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.institution) {
      filtered = filtered.filter(reg => reg.institution_name === filters.institution);
    }

    if (filters.schoolYear) {
      filtered = filtered.filter(reg => reg.school_year === filters.schoolYear);
    }

    if (filters.city) {
      filtered = filtered.filter(reg => reg.city.toLowerCase().includes(filters.city.toLowerCase()));
    }

    if (filters.state) {
      filtered = filtered.filter(reg => reg.state.toLowerCase().includes(filters.state.toLowerCase()));
    }

    setFilteredRegistrations(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'WhatsApp',
      'Data Nascimento',
      'Instituição',
      'Ano Escolar',
      'Curso',
      'Cidade',
      'Estado',
      'Data Matrícula'
    ];

    const csvData = filteredRegistrations.map(reg => [
      reg.full_name,
      reg.email,
      reg.phone,
      reg.whatsapp,
      reg.birth_date,
      reg.institution_name,
      reg.school_year,
      reg.course_name,
      reg.city,
      reg.state,
      new Date(reg.registration_date).toLocaleDateString('pt-BR')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `matriculas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getUniqueValues = (field: keyof StudentRegistration) => {
    return [...new Set(registrations.map(reg => reg[field]))].filter(Boolean);
  };

  if (isLoading) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Relatórios de Matrícula</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Relatórios de Matrícula</h1>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Matrículas</p>
                <p className="text-2xl font-bold">{metrics.totalRegistrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Idade Média</p>
                <p className="text-2xl font-bold">{metrics.averageAge} anos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <School className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Instituições</p>
                <p className="text-2xl font-bold">{getUniqueValues('institution_name').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Cidades</p>
                <p className="text-2xl font-bold">{getUniqueValues('city').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Faixa Etária</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={metrics.ageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, count }) => `${range}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {metrics.ageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matrículas por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics.monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Institutions */}
      <Card>
        <CardHeader>
          <CardTitle>Principais Instituições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.topInstitutions.map((institution, index) => (
              <div key={institution.name} className="flex justify-between items-center">
                <span className="font-medium">{institution.name}</span>
                <Badge variant="secondary">{institution.count} estudantes</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Buscar por nome, email..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, institution: value === 'all' ? '' : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Instituição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {getUniqueValues('institution_name').map(institution => (
                  <SelectItem key={institution} value={institution}>
                    {institution}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, schoolYear: value === 'all' ? '' : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Ano Escolar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {getUniqueValues('school_year').map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Cidade"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            />

            <Input
              placeholder="Estado"
              value={filters.state}
              onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Matrículas ({filteredRegistrations.length})</CardTitle>
          <CardDescription>
            Dados detalhados de todos os estudantes matriculados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Ano Escolar</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Data Matrícula</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">{registration.full_name}</TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>{registration.phone}</TableCell>
                    <TableCell>{registration.institution_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{registration.school_year}</Badge>
                    </TableCell>
                    <TableCell>{registration.city}, {registration.state}</TableCell>
                    <TableCell>
                      {new Date(registration.registration_date).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}