import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Share2, 
  Filter, 
  Calendar as CalendarIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Table as TableIcon,
  TrendingUp,
  Star
} from "lucide-react";
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";

export default function Report() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [chartType, setChartType] = useState("overview");

  // Mock Data for Reports
  const performanceData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Cursos Concluídos',
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'Novas Turmas',
        data: [8, 12, 10, 15, 14, 18],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ],
  };

  const categoryData = {
    labels: ['Tecnologia', 'Gestão', 'Idiomas', 'Marketing', 'Design'],
    datasets: [
      {
        label: 'Alunos por Categoria',
        data: [350, 210, 180, 150, 120],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const handleExport = async () => {
    if (reportRef.current) {
      try {
        toast.loading("Gerando relatório...", { id: "export" });
        const canvas = await html2canvas(reportRef.current, {
          scale: 2,
          backgroundColor: '#f8fafc',
          useCORS: true,
        });
        
        const link = document.createElement('a');
        link.download = `relatorio-cursos-${format(new Date(), 'yyyy-MM-dd')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success("Relatório exportado com sucesso!", { 
          id: "export",
          description: "O arquivo foi baixado para sua pasta de downloads."
        });
      } catch (error) {
        console.error('Erro ao exportar relatório:', error);
        toast.error("Erro ao exportar relatório", { 
          id: "export",
          description: "Tente novamente mais tarde."
        });
      }
    }
  };

  const handleShare = () => {
    toast.info("Funcionalidade de compartilhamento em desenvolvimento", {
      description: "Em breve você poderá compartilhar relatórios."
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Relatório de Desempenho</h1>
          <p className="text-muted-foreground mt-1">
            Análise detalhada de cursos, instrutores e alunos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 3 meses</SelectItem>
              <SelectItem value="1y">Este ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExport} className="hover:bg-muted/50">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleShare} className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Main Report Content */}
      <div ref={reportRef} className="space-y-8 bg-background p-1 rounded-xl">
        
        {/* Key Metrics - Destaques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-200 dark:border-indigo-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total de Alunos
              </CardDescription>
              <CardTitle className="text-5xl font-bold text-indigo-900 dark:text-indigo-100 mt-2">1,248</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-semibold">
                +12% este mês
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Taxa de Aprovação
              </CardDescription>
              <CardTitle className="text-5xl font-bold text-emerald-900 dark:text-emerald-100 mt-2">94.2%</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-semibold">
                +2.1% este mês
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Horas de Aula
              </CardDescription>
              <CardTitle className="text-5xl font-bold text-amber-900 dark:text-amber-100 mt-2">3,450</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-semibold">
                +8% este mês
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Charts */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={setChartType}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChartIcon className="w-4 h-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <LineChartIcon className="w-4 h-4" />
                Tendências
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                Distribuição
              </TabsTrigger>
            </TabsList>
            
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-display">Desempenho Mensal</CardTitle>
                <CardDescription className="mt-1">Comparativo entre cursos concluídos e novas turmas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <Bar 
                    data={performanceData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'top',
                          labels: {
                            font: {
                              family: "'Inter', sans-serif",
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          padding: 12,
                          borderRadius: 8
                        }
                      },
                      scales: {
                        y: { 
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          ticks: {
                            font: {
                              family: "'Inter', sans-serif",
                              size: 11
                            }
                          }
                        },
                        x: {
                          ticks: {
                            font: {
                              family: "'Inter', sans-serif",
                              size: 11
                            }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-display">Tendência de Matrículas</CardTitle>
                <CardDescription className="mt-1">Evolução do número de alunos nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <Line 
                    data={{
                      labels: performanceData.labels,
                      datasets: [{
                        label: 'Total de Matrículas',
                        data: [150, 180, 210, 240, 280, 320],
                        borderColor: 'rgba(99, 102, 241, 1)',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                      }]
                    }} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            font: {
                              family: "'Inter', sans-serif",
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          padding: 12,
                          borderRadius: 8
                        }
                      },
                      scales: {
                        y: {
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          ticks: {
                            font: {
                              family: "'Inter', sans-serif",
                              size: 11
                            }
                          }
                        },
                        x: {
                          ticks: {
                            font: {
                              family: "'Inter', sans-serif",
                              size: 11
                            }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-display">Alunos por Categoria</CardTitle>
                  <CardDescription className="mt-1">Distribuição de matrículas por área de conhecimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full flex justify-center">
                    <Doughnut 
                      data={categoryData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { 
                            position: 'right',
                            labels: {
                              font: {
                                family: "'Inter', sans-serif",
                                size: 12
                              }
                            }
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            borderRadius: 8
                          }
                        }
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-display">Status dos Alunos</CardTitle>
                  <CardDescription className="mt-1">Situação atual da base de alunos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full flex justify-center">
                    <Doughnut 
                      data={{
                        labels: ['Ativos', 'Inativos', 'Formados'],
                        datasets: [{
                          data: [65, 15, 20],
                          backgroundColor: [
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                          ],
                          borderWidth: 0
                        }]
                      }} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { 
                            position: 'right',
                            labels: {
                              font: {
                                family: "'Inter', sans-serif",
                                size: 12
                              }
                            }
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            borderRadius: 8
                          }
                        }
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Detailed Table */}
        <Card className="border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-display">Detalhamento por Curso</CardTitle>
              <CardDescription className="mt-1">Dados granulares para análise profunda</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="hover:bg-muted/50">
              <TableIcon className="w-4 h-4 mr-2" />
              Ver Tabela Completa
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-left">Curso</th>
                    <th className="px-6 py-3 font-semibold text-left">Categoria</th>
                    <th className="px-6 py-3 font-semibold text-center">Alunos</th>
                    <th className="px-6 py-3 font-semibold text-center">Conclusão</th>
                    <th className="px-6 py-3 font-semibold text-center">Avaliação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { name: "Desenvolvimento Web Fullstack", cat: "Tecnologia", students: 124, completion: "85%", rating: 4.8 },
                    { name: "Gestão de Projetos Ágeis", cat: "Gestão", students: 89, completion: "92%", rating: 4.7 },
                    { name: "Inglês para Negócios", cat: "Idiomas", students: 210, completion: "78%", rating: 4.5 },
                    { name: "Marketing Digital 360", cat: "Marketing", students: 156, completion: "88%", rating: 4.6 },
                    { name: "UX/UI Design Fundamentals", cat: "Design", students: 98, completion: "95%", rating: 4.9 },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4 font-semibold">{row.name}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-medium">
                          {row.cat}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">{row.students}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 font-semibold">
                          {row.completion}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-bold text-foreground">{row.rating}</span>
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
