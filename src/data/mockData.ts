export interface DetailedStudent {
  id: string; name: string; age: number; major: 'Ciencia de la Computación' | 'Ingeniería Eléctrica' | 'Biología' | 'Matemáticas' | 'Física' | 'Química'; scholarship_holder: boolean; admission_grade: number; current_avg_grade: number; risk: 'Low' | 'Medium' | 'High';
}
export interface Materia { id: number; nombre: string; ciclo_materia: number; }
export interface Semestre { id: number; nombre: string; fecha_inicio: string; fecha_fin: string; }

// --- Nuevas Interfaces y Datos ---
export interface Payment {
    id: number;
    studentName: string;
    amount: number;
    status: 'Pagado' | 'Pendiente' | 'Vencido';
    dueDate: string;
    paidDate: string | null;
}
export interface AttendanceRecord {
    id: number;
    studentName: string;
    materia: string;
    date: string;
    status: 'Presente' | 'Ausente';
}

export const payments: Payment[] = Array.from({ length: 20 }, (_, i) => {
    const statuses: Array<'Pagado' | 'Pendiente' | 'Vencido'> = ['Pagado', 'Pendiente', 'Vencido'];
    const status = statuses[i % 3];
    return {
        id: i + 1,
        studentName: `Estudiante ${i + 1}`,
        amount: 500 + (i * 10),
        status: status,
        dueDate: `2025-11-${(i % 30) + 1}`,
        paidDate: status === 'Pagado' ? `2025-11-${(i % 28) + 1}` : null,
    };
});

export const attendanceRecords: AttendanceRecord[] = Array.from({ length: 40 }, (_, i) => {
    const students = ['Ana Garcia', 'Juan Perez', 'Maria Lopez', 'Carlos Ruiz'];
    const materias = ["Matemática I", "Programación I", "Base de Datos", "Inteligencia Artificial"];
    return {
        id: i + 1,
        studentName: students[i % students.length],
        materia: materias[i % materias.length],
        date: `2025-11-${(i % 20) + 1}`,
        status: Math.random() > 0.2 ? 'Presente' : 'Ausente',
    };
});


// --- Datos Existentes ---
export const adminStudents = Array.from({ length: 15 }, (_, i) => ({ id: (i + 1).toString(), nombre: `Estudiante ${i + 1}`, apellido: `Apellido ${i + 1}`, email: `estudiante${i+1}@example.com` }));
export const materias: Materia[] = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, nombre: `Materia ${i + 1}`, ciclo_materia: (i % 6) + 1 }));
export const semestres: Semestre[] = Array.from({ length: 12 }, (_, i) => { const year = 2024 + Math.floor(i / 2); const period = (i % 2) + 1; return { id: i + 1, nombre: `${year}-${period}`, fecha_inicio: `${year}-${period === 1 ? '03' : '08'}-01`, fecha_fin: `${year}-${period === 1 ? '07' : '12'}-15` }; });
export const detailedStudents: DetailedStudent[] = [ /* existing data */ ];
export const majors = [...new Set(detailedStudents.map(s => s.major))];
