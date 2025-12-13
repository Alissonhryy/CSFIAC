import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Filter,
  Calendar,
  Users,
  Clock,
  BookOpen,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Course {
  id: number;
  name: string;
  instructor: string;
  students: number;
  status: "Em Andamento" | "Concluído" | "Pendente";
  startDate: string;
  duration: string;
  category: string;
  description?: string;
}

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    instructor: "",
    category: "",
    duration: "",
    startDate: "",
    description: "",
  });

  const [courses, setCourses] = useState<Course[]>([
    { 
      id: 1, 
      name: "Desenvolvimento Web Fullstack", 
      instructor: "Ana Silva", 
      students: 124, 
      status: "Em Andamento", 
      startDate: "15/01/2024",
      duration: "6 meses",
      category: "Tecnologia"
    },
    { 
      id: 2, 
      name: "Gestão de Projetos Ágeis", 
      instructor: "Carlos Souza", 
      students: 89, 
      status: "Concluído", 
      startDate: "10/11/2023",
      duration: "3 meses",
      category: "Gestão"
    },
    { 
      id: 3, 
      name: "Inglês para Negócios", 
      instructor: "Beatriz Costa", 
      students: 210, 
      status: "Pendente", 
      startDate: "20/02/2024",
      duration: "12 meses",
      category: "Idiomas"
    },
    { 
      id: 4, 
      name: "Marketing Digital 360", 
      instructor: "Daniel Oliveira", 
      students: 156, 
      status: "Em Andamento", 
      startDate: "05/01/2024",
      duration: "4 meses",
      category: "Marketing"
    },
    { 
      id: 5, 
      name: "UX/UI Design Fundamentals", 
      instructor: "Elena Martins", 
      students: 98, 
      status: "Concluído", 
      startDate: "01/10/2023",
      duration: "5 meses",
      category: "Design"
    },
  ]);

  const categories = Array.from(new Set(courses.map((c: Course) => c.category)));

  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateCourse = () => {
    if (!newCourse.name || !newCourse.instructor || !newCourse.category || !newCourse.duration || !newCourse.startDate) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const course: Course = {
      id: courses.length + 1,
      name: newCourse.name,
      instructor: newCourse.instructor,
      students: 0,
      status: "Pendente",
      startDate: newCourse.startDate,
      duration: newCourse.duration,
      category: newCourse.category,
      description: newCourse.description,
    };

    setCourses([...courses, course]);
    setNewCourse({
      name: "",
      instructor: "",
      category: "",
      duration: "",
      startDate: "",
      description: "",
    });
    setIsDialogOpen(false);
    toast.success("Curso criado com sucesso!");
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Concluído': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Em Andamento': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Pendente': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Cursos</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os cursos e turmas disponíveis.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Curso</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para criar um novo curso.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Curso *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Desenvolvimento Web Fullstack"
                  value={newCourse.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instructor">Instrutor *</Label>
                <Input
                  id="instructor"
                  placeholder="Ex: Ana Silva"
                  value={newCourse.instructor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={newCourse.category}
                    onValueChange={(value: string) => setNewCourse({ ...newCourse, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duração *</Label>
                  <Input
                    id="duration"
                    placeholder="Ex: 6 meses"
                  value={newCourse.duration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newCourse.startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourse({ ...newCourse, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o curso..."
                  value={newCourse.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCourse}>
                Criar Curso
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input 
                placeholder="Buscar por nome ou instrutor..." 
                className="pl-9 bg-muted/30 border-border focus:bg-background focus:border-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] bg-background border-border hover:border-primary transition-colors">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] bg-background border-border hover:border-primary transition-colors">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(statusFilter !== "all" || categoryFilter !== "all" || searchTerm) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setStatusFilter("all");
                    setCategoryFilter("all");
                    setSearchTerm("");
                  }}
                  className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Limpar filtros"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <BookOpen className="w-8 h-8" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Nenhum curso encontrado</EmptyTitle>
                <EmptyDescription>
                  {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                    ? "Tente ajustar os filtros de busca para encontrar cursos."
                    : "Comece criando seu primeiro curso."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-6 py-4 font-medium rounded-tl-lg">Curso</th>
                  <th className="px-6 py-4 font-medium">Instrutor</th>
                  <th className="px-6 py-4 font-medium">Categoria</th>
                  <th className="px-6 py-4 font-medium">Duração</th>
                  <th className="px-6 py-4 font-medium">Início</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCourses.map((course, index) => (
                  <tr key={course.id} className="hover:bg-muted/20 transition-all duration-200 group stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{course.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Users className="w-3 h-3 mr-1" />
                        {course.students} alunos
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {course.instructor.charAt(0)}
                        </div>
                        {course.instructor}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-normal bg-background">
                        {course.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {course.startDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="outline" 
                        className={`font-medium ${getStatusColor(course.status)}`}
                      >
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">Editar Detalhes</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Gerenciar Alunos</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer focus:text-destructive">Arquivar Curso</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
