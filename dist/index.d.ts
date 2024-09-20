declare class PipelineBase {
    protected pipeline: ((data: any) => any)[];
    constructor();
    addPipeline(func: (data: any[]) => any[]): this;
    runPipeline<T = any>(data: any[]): T;
}

interface IMarked {
    table_start: number;
    row_start: number;
}
declare abstract class BaseCrawler {
    private readonly pipeline;
    private readonly host;
    private readonly marked;
    constructor(host: string, pipeline?: PipelineBase, marked?: IMarked);
    protected fetchData(): Promise<any>;
    craw<T = any>(): Promise<T>;
    protected abstract mapping(): object;
    protected abstract parse(data: any): any;
}

interface SubjectStudent {
    student: {
        sid: string;
    };
    subjects: object[];
}
declare class SubjectPipeline extends PipelineBase {
    constructor();
    addAggregateBySID(): this;
}

type ICalendarSubject = Record<string, Omit<ICalendar, "subjectClassCode">[]>;
declare class CalendarPipeline extends PipelineBase {
    constructor();
    addAggregateBySubjectClassCode(): this;
    addFilterByGroup(groupName: string): this;
}

interface ICalendar extends Omit<Required<ICalendarOption>, "semester"> {
    credit: number;
    numStudent: number;
    session: number[];
    group: string;
    sessionOfDay: string;
}
interface ICalendarOption {
    semester?: string;
    subjectCode?: string;
    subjectClassCode?: string;
    subjectName?: string;
    teacher?: string;
    dayOfWeek?: string;
    lectureHall?: string;
}
declare class Calendar extends BaseCrawler {
    static readonly DefaultHost: string;
    private options;
    constructor(options?: ICalendarOption, pipeline?: CalendarPipeline);
    protected mapping(): {
        slt_namhoc: string | undefined;
        slt_mamonhoc_filter: string | undefined;
        slt_monhoc_filter: string | undefined;
        slt_malopmonhoc_filter: string | undefined;
        slt_giaovien_filter: string | undefined;
        slt_thu_filter: string | undefined;
        slt_giangduong_filter: string | undefined;
    };
    protected parse(data: string[]): ICalendar | undefined;
    private parseSession;
}

interface Student {
    sid: string;
    name: string;
    dob: Date;
    officialClass: string;
}
interface ISubject {
    student: Student;
    subjectCode: string;
    subjectName: string;
    group: string;
    credit: number;
    note: string;
    semester: string;
}
interface ISubjectOption {
    sid?: string;
    name?: string;
    dob?: string;
    officialClass?: string;
    subjectCode?: string;
    subjectName?: string;
    group?: string;
    credit?: number;
    note?: string;
    semester?: string;
}
declare class Subject extends BaseCrawler {
    static readonly DefaultHost: string;
    private options;
    constructor(options?: ISubjectOption, pipeline?: SubjectPipeline);
    protected mapping(): {
        "SinhvienLmh[masvTitle]": string | undefined;
        "SinhvienLmh[hotenTitle]": string | undefined;
        "SinhvienLmh[ngaysinhTitle]": string | undefined;
        "SinhvienLmh[lopkhoahocTitle]": string | undefined;
        "SinhvienLmh[tenlopmonhocTitle]": string | undefined;
        "SinhvienLmh[tenmonhocTitle]": string | undefined;
        "SinhvienLmh[nhom]": string | undefined;
        "SinhvienLmh[sotinchiTitle]": number | undefined;
        "SinhvienLmh[ghichu]": string | undefined;
        "SinhvienLmh[term_id]": string | undefined;
    };
    protected parse(data: string[]): ISubject | undefined;
}

type UET_Calendar = Calendar;
declare const UET_Calendar: typeof Calendar;
type UET_CalendarPipeline = CalendarPipeline;
declare const UET_CalendarPipeline: typeof CalendarPipeline;
type UET_ICalendar = ICalendar;
type UET_ICalendarOption = ICalendarOption;
type UET_ICalendarSubject = ICalendarSubject;
type UET_ISubject = ISubject;
type UET_ISubjectOption = ISubjectOption;
type UET_Student = Student;
type UET_Subject = Subject;
declare const UET_Subject: typeof Subject;
type UET_SubjectPipeline = SubjectPipeline;
declare const UET_SubjectPipeline: typeof SubjectPipeline;
type UET_SubjectStudent = SubjectStudent;
declare namespace UET {
  export { UET_Calendar as Calendar, UET_CalendarPipeline as CalendarPipeline, type UET_ICalendar as ICalendar, type UET_ICalendarOption as ICalendarOption, type UET_ICalendarSubject as ICalendarSubject, type UET_ISubject as ISubject, type UET_ISubjectOption as ISubjectOption, type UET_Student as Student, UET_Subject as Subject, UET_SubjectPipeline as SubjectPipeline, type UET_SubjectStudent as SubjectStudent };
}

export { Calendar, CalendarPipeline, type ICalendar, type ICalendarOption, type ICalendarSubject, type ISubject, type ISubjectOption, type Student, Subject, SubjectPipeline, type SubjectStudent, UET as default };
