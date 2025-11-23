export interface DetailedStudent {
  id: string;
  name: string;
  age: number;
  major: 'Ciencia de la Computación' | 'Ingeniería Eléctrica' | 'Biología' | 'Matemáticas' | 'Física' | 'Química';
  scholarship_holder: boolean;
  admission_grade: number; // Grade out of 100
  current_avg_grade: number; // Grade out of 100
  risk: 'Low' | 'Medium' | 'High';
}

export const detailedStudents: DetailedStudent[] = [
  { id: '1', name: 'Ana Garcia', age: 20, major: 'Ciencia de la Computación', scholarship_holder: true, admission_grade: 92, current_avg_grade: 88, risk: 'Low' },
  { id: '2', name: 'Juan Perez', age: 21, major: 'Ingeniería Eléctrica', scholarship_holder: false, admission_grade: 85, current_avg_grade: 76, risk: 'Medium' },
  { id: '3', name: 'Maria Lopez', age: 19, major: 'Biología', scholarship_holder: true, admission_grade: 95, current_avg_grade: 65, risk: 'High' },
  { id: '4', name: 'Carlos Ruiz', age: 22, major: 'Matemáticas', scholarship_holder: false, admission_grade: 88, current_avg_grade: 91, risk: 'Low' },
  { id: '5', name: 'Laura Martinez', age: 20, major: 'Física', scholarship_holder: true, admission_grade: 90, current_avg_grade: 82, risk: 'Low' },
  { id: '6', name: 'Pedro Sanchez', age: 23, major: 'Química', scholarship_holder: false, admission_grade: 78, current_avg_grade: 68, risk: 'High' },
  { id: '7', name: 'Sofia Hernandez', age: 20, major: 'Ciencia de la Computación', scholarship_holder: false, admission_grade: 91, current_avg_grade: 85, risk: 'Low' },
  { id: '8', name: 'David Gomez', age: 21, major: 'Ingeniería Eléctrica', scholarship_holder: true, admission_grade: 82, current_avg_grade: 72, risk: 'Medium' },
  { id: '9', name: 'Isabel Torres', age: 19, major: 'Biología', scholarship_holder: false, admission_grade: 89, current_avg_grade: 70, risk: 'Medium' },
  { id: '10', name: 'Javier Diaz', age: 22, major: 'Matemáticas', scholarship_holder: true, admission_grade: 94, current_avg_grade: 89, risk: 'Low' },
  { id: '11', name: 'Elena Flores', age: 20, major: 'Ciencia de la Computación', scholarship_holder: true, admission_grade: 87, current_avg_grade: 75, risk: 'Medium' },
  { id: '12', name: 'Miguel Angel', age: 23, major: 'Física', scholarship_holder: false, admission_grade: 81, current_avg_grade: 77, risk: 'Low' },
];

export const majors = [...new Set(detailedStudents.map(s => s.major))];