import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Mail, 
  Phone, 
  MoreVertical,
  BookOpen,
  Star,
  MessageSquare,
  Users,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Instructor {
  id: number;
  name: string;
  role: string;
  specialty: string;
  courses: number;
  students: number;
  rating: number;
  email: string;
  phone: string;
  avatar: string;
  status: "Ativo" | "Inativo" | "Licença";
}

export default function Instructors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    role: "",
    specialty: "",
    email: "",
    phone: "",
  });

  const [instructors, setInstructors] = useState<Instructor[]>([
    {
      id: 1,
      name: "Ana Silva",
      role: "Senior Developer",
      specialty: "Fullstack Web",
      courses: 12,
      students: 450,
      rating: 4.9,
      email: "ana.silva@csf.edu",
      phone: "+55 11 99999-9999",
      avatar: "https://i.pravatar.cc/150?u=1",
      status: "Ativo"
    },
    {
      id: 2,
      name: "Carlos Souza",
      role: "Agile Coach",
      specialty: "Gestão de Projetos",
      courses: 8,
      students: 320,
      rating: 4.8,
      email: "carlos.souza@csf.edu",
      phone: "+55 11 98888-8888",
      avatar: "https://i.pravatar.cc/150?u=2",
      status: "Ativo"
    },
    {
      id: 3,
      name: "Beatriz Costa",
      role: "English Teacher",
      specialty: "Idiomas",
      courses: 15,
      students: 600,
      rating: 4.7,
      email: "beatriz.costa@csf.edu",
      phone: "+55 11 97777-7777",
      avatar: "https://i.pravatar.cc/150?u=3",
      status: "Licença"
    },
    {
      id: 4,
      name: "Daniel Oliveira",
      role: "Marketing Specialist",
      specialty: "Marketing Digital",
      courses: 6,
      students: 210,
      rating: 4.6,
      email: "daniel.oliveira@csf.edu",
      phone: "+55 11 96666-6666",
      avatar: "https://i.pravatar.cc/150?u=4",
      status: "Ativo"
    },
    {
      id: 5,
      name: "Elena Martins",
      role: "Product Designer",
      specialty: "UX/UI Design",
      courses: 10,
      students: 380,
      rating: 4.9,
      email: "elena.martins@csf.edu",
      phone: "+55 11 95555-5555",
      avatar: "https://i.pravatar.cc/150?u=5",
      status: "Ativo"
    },
    {
      id: 6,
      name: "Fernando Lima",
      role: "Data Scientist",
      specialty: "Data Science",
      courses: 5,
      students: 150,
      rating: 4.8,
      email: "fernando.lima@csf.edu",
      phone: "+55 11 94444-4444",
      avatar: "https://i.pravatar.cc/150?u=6",
      status: "Inativo"
    }
  ]);

  const specialties = Array.from(new Set(instructors.map((i: Instructor) => i.specialty)));

  const filteredInstructors = instructors.filter((instructor: Instructor) => {
    const matchesSearch = 
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || instructor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInstructor = () => {
    if (!newInstructor.name || !newInstructor.role || !newInstructor.specialty || !newInstructor.email || !newInstructor.phone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const instructor: Instructor = {
      id: instructors.length + 1,
      name: newInstructor.name,
      role: newInstructor.role,
      specialty: newInstructor.specialty,
      courses: 0,
      students: 0,
      rating: 0,
      email: newInstructor.email,
      phone: newInstructor.phone,
      avatar: `https://i.pravatar.cc/150?u=${instructors.length + 1}`,
      status: "Ativo"
    };

    setInstructors([...instructors, instructor]);
    setNewInstructor({
      name: "",
      role: "",
      specialty: "",
      email: "",
      phone: "",
    });
    setIsDialogOpen(false);
    toast.success("Instrutor criado com sucesso!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Instrutores</h1>
          <p className="text-muted-foreground mt-1">Equipe docente e especialistas.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Novo Instrutor
        </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Instrutor</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para adicionar um novo instrutor.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="instructor-name">Nome Completo *</Label>
                <Input
                  id="instructor-name"
                  placeholder="Ex: Ana Silva"
                  value={newInstructor.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="instructor-role">Cargo/Função *</Label>
                  <Input
                    id="instructor-role"
                    placeholder="Ex: Senior Developer"
                    value={newInstructor.role}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInstructor({ ...newInstructor, role: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructor-specialty">Especialidade *</Label>
                  <Select
                    value={newInstructor.specialty}
                    onValueChange={(value: string) => setNewInstructor({ ...newInstructor, specialty: value })}
                  >
                    <SelectTrigger id="instructor-specialty">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="instructor-email">Email *</Label>
                  <Input
                    id="instructor-email"
                    type="email"
                    placeholder="exemplo@csf.edu"
                    value={newInstructor.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructor-phone">Telefone *</Label>
                  <Input
                    id="instructor-phone"
                    placeholder="+55 11 99999-9999"
                    value={newInstructor.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInstructor({ ...newInstructor, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateInstructor}>
                Adicionar Instrutor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input 
            placeholder="Buscar por nome ou especialidade..." 
            className="pl-9 bg-muted/30 border-border focus:bg-background focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
              <SelectItem value="Licença">Licença</SelectItem>
            </SelectContent>
          </Select>
          {(statusFilter !== "all" || searchTerm) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setStatusFilter("all");
                setSearchTerm("");
              }}
              className="h-9 w-9"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {filteredInstructors.length === 0 ? (
        <Empty>
          <EmptyMedia variant="icon">
            <Users className="w-8 h-8" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Nenhum instrutor encontrado</EmptyTitle>
            <EmptyDescription>
              {searchTerm || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca para encontrar instrutores."
                : "Comece adicionando seu primeiro instrutor."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor: Instructor, index: number) => (
          <Card 
            key={instructor.id} 
            className="border shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group rounded-2xl bg-card/80 backdrop-blur-sm overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative pb-2">
              <div className="absolute top-4 right-4 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">Ver Perfil</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Editar Dados</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Atribuir Curso</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col items-center text-center pt-4">
                <Avatar className="w-28 h-28 mb-4 border-4 border-background shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 ring-2 ring-primary/10">
                  <AvatarImage src={instructor.avatar} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                    {instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-display mb-1">{instructor.name}</CardTitle>
                <CardDescription className="text-primary font-semibold text-sm">{instructor.role}</CardDescription>
                <Badge variant="outline" className="mt-3 font-medium bg-background border-primary/20 text-primary hover:border-primary transition-colors">
                  {instructor.specialty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-4 relative z-10">
              <div className="grid grid-cols-3 gap-3 text-center divide-x divide-border bg-muted/30 rounded-xl p-3">
                <div className="px-2">
                  <div className="text-2xl font-bold text-foreground mb-1">{instructor.courses}</div>
                  <div className="text-xs text-muted-foreground font-medium">Cursos</div>
                </div>
                <div className="px-2">
                  <div className="text-2xl font-bold text-foreground mb-1">{instructor.students}</div>
                  <div className="text-xs text-muted-foreground font-medium">Alunos</div>
                </div>
                <div className="px-2">
                  <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1 mb-1">
                    {instructor.rating} 
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">Avaliação</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-2 relative z-10">
              <Button 
                variant="outline" 
                className="flex-1 h-10 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                onClick={() => toast.info(`Enviando email para ${instructor.email}`)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-10 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                onClick={() => toast.info(`Abrindo chat com ${instructor.name}`)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </CardFooter>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
}
