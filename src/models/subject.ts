import { Student } from "./student";

export interface Subject {
    student: Student,
    subjectCode: string,
    subjectName: string,
    group: string,
    credit: number,
    note: string,
    semester: string
}