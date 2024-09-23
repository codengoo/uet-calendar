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
    student: IStudent;
    subjects: Omit<ISubject, "student">[];
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
    sessionInHour: number[];
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

interface IStudent {
    sid: string;
    name: string;
    dob: Date;
    officialClass: string;
}
interface ISubject {
    student: IStudent;
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

type UETCrawler_Calendar = Calendar;
declare const UETCrawler_Calendar: typeof Calendar;
type UETCrawler_CalendarPipeline = CalendarPipeline;
declare const UETCrawler_CalendarPipeline: typeof CalendarPipeline;
type UETCrawler_ICalendar = ICalendar;
type UETCrawler_ICalendarOption = ICalendarOption;
type UETCrawler_ICalendarSubject = ICalendarSubject;
type UETCrawler_IStudent = IStudent;
type UETCrawler_ISubject = ISubject;
type UETCrawler_ISubjectOption = ISubjectOption;
type UETCrawler_Subject = Subject;
declare const UETCrawler_Subject: typeof Subject;
type UETCrawler_SubjectPipeline = SubjectPipeline;
declare const UETCrawler_SubjectPipeline: typeof SubjectPipeline;
type UETCrawler_SubjectStudent = SubjectStudent;
declare namespace UETCrawler {
  export { UETCrawler_Calendar as Calendar, UETCrawler_CalendarPipeline as CalendarPipeline, type UETCrawler_ICalendar as ICalendar, type UETCrawler_ICalendarOption as ICalendarOption, type UETCrawler_ICalendarSubject as ICalendarSubject, type UETCrawler_IStudent as IStudent, type UETCrawler_ISubject as ISubject, type UETCrawler_ISubjectOption as ISubjectOption, UETCrawler_Subject as Subject, UETCrawler_SubjectPipeline as SubjectPipeline, type UETCrawler_SubjectStudent as SubjectStudent };
}

export { Calendar, CalendarPipeline, type ICalendar, type ICalendarOption, type ICalendarSubject, type IStudent, type ISubject, type ISubjectOption, Subject, SubjectPipeline, type SubjectStudent, UETCrawler as default };
