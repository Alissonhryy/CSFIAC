import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  TrendingUp,
  Download
} from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { toast } from "sonner";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

export default function Dashboard() {
  // Mock Data
  const stats = [
    { 
      title: "Total de Cursos", 
      value: "24", 
      change: "+12%", 
      trend: "up", 
      icon: BookOpen,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      borderColor: "border-indigo-200 dark:border-indigo-800"
    },
    { 
      title: "Instrutores Ativos", 
      value: "12", 
      change: "+4%", 
      trend: "up", 
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    { 
      title: "Alunos Matriculados", 
      value: "843", 
      change: "+18%", 
      trend: "up", 
      icon: GraduationCap,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-800"
    },
    { 
      title: "Taxa de Conclusão", 
      value: "92%", 
      change: "-2%", 
      trend: "down", 
      icon: CheckCircle2,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-200 dark:border-amber-800"
    },
  ];

  const recentCourses = [
    { name: "Introdução ao React", instructor: "Ana Silva", students: 45, status: "Em Andamento", progress: 65 },
    { name: "UX Design Avançado", instructor: "Carlos Souza", students: 32, status: "Concluído", progress: 100 },
    { name: "Marketing Digital", instructor: "Beatriz Costa", students: 28, status: "Pendente", progress: 0 },
    { name: "Python para Dados", instructor: "Daniel Oliveira", students: 56, status: "Em Andamento", progress: 42 },
  ];

  // Chart Data
  const doughnutData = {
    labels: ['Concluídos', 'Em Andamento', 'Pendentes'],
    datasets: [
      {
        data: [12, 8, 4],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Emerald
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(245, 158, 11, 0.8)', // Amber
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Novas Matrículas',
        data: [65, 59, 80, 81, 56, 95],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgba(99, 102, 241, 1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      }
    }
  };

  const handleExportReport = () => {
    toast.success("Relatório exportado com sucesso!", {
      description: "O arquivo foi baixado para sua pasta de downloads."
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do desempenho dos cursos e instrutores.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-background hover:bg-muted/50">
            <Calendar className="w-4 h-4 mr-2" />
            Últimos 30 dias
          </Button>
          <Button onClick={handleExportReport} className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Bento Grid - Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={`border ${stat.borderColor} shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden group`}
          >
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-sm`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  stat.trend === 'up' 
                    ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                    : 'text-rose-700 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-display">Crescimento de Matrículas</CardTitle>
                <CardDescription className="mt-1">Acompanhamento mensal de novos alunos</CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18% este mês
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Line data={lineData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-display">Status dos Cursos</CardTitle>
            <CardDescription className="mt-1">Distribuição atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <Doughnut 
                data={doughnutData} 
                options={{
                  ...chartOptions,
                  cutout: '70%',
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { 
                        usePointStyle: true, 
                        padding: 20,
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

      {/* Recent Courses Table */}
      <Card className="border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-display">Cursos Recentes</CardTitle>
            <CardDescription className="mt-1">Últimos cursos adicionados ou atualizados</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-muted/50">Ver todos</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold text-left">Curso</th>
                  <th className="px-6 py-4 font-semibold text-left">Instrutor</th>
                  <th className="px-6 py-4 font-semibold text-left">Alunos</th>
                  <th className="px-6 py-4 font-semibold text-left">Status</th>
                  <th className="px-6 py-4 font-semibold text-left">Progresso</th>
                  <th className="px-6 py-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentCourses.map((course, index) => (
                  <tr key={index} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{course.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                          {course.instructor.charAt(0)}
                        </div>
                        <span className="text-muted-foreground">{course.instructor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">{course.students}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="outline" 
                        className={`font-medium ${
                          course.status === 'Concluído' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                          course.status === 'Em Andamento' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                        }`}
                      >
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              course.progress === 100 
                                ? 'bg-emerald-500' 
                                : course.progress >= 50
                                ? 'bg-primary'
                                : 'bg-amber-500'
                            }`} 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground min-w-[35px]">{course.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
