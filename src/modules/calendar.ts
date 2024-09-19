import { extractCol, extractRow, extractTable } from "../utils";
import { BaseCrawler } from "./base";
import { PipelineBase } from "./pipeline";

export interface ICalendar extends Omit<Required<ICalendarOption>, "semester"> {
    credit: number;
    numStudent: number;
    session: number[];
    group: string;
    sessionOfDay: string
}

export interface ICalendarOption {
    semester?: string;
    subjectCode?: string;
    subjectClassCode?: string;
    subjectName?: string;
    teacher?: string;
    dayOfWeek?: string;
    lectureHall?: string
}

export type ICalendarSubject = Record<string, Omit<ICalendar, "subjectClassCode">[]>

export class CalendarPipeline extends PipelineBase {
    constructor() {
        super();
    }

    public addAggregateBySubjectClassCode(): this {
        this.pipeline.push((data: ICalendar[]): ICalendarSubject => {

            return data.reduce((acc, item) => {
                const { subjectClassCode, ...rest } = item

                if (!acc[subjectClassCode]) {
                    acc[subjectClassCode] = [rest];
                } else {
                    acc[subjectClassCode].push({ ...rest });
                }
                return acc;
            }, {} as ICalendarSubject);
        });

        return this;
    }

    public addFilterByGroup(groupName: string): this {
        this.pipeline.push((data: ICalendarSubject) => {
            const values = Object.values(data).map(subject =>
                subject.filter(item =>
                    item.group === groupName || item.group === "CL"
                ))
            return Object.keys(data).map((key, index) => ({ [key]: values[index] }));
        });

        return this;
    }
}

export class Calendar extends BaseCrawler {
    public static readonly DefaultHost: string = "http://112.137.129.115/tkb/listbylist.php";
    private options: ICalendarOption;

    constructor(options?: ICalendarOption, pipeline?: CalendarPipeline) {
        super(Calendar.DefaultHost, pipeline);
        this.options = options || {};
    }

    protected mapping() {
        return {
            "slt_namhoc": this.options.semester,
            "slt_mamonhoc_filter": this.options.subjectCode,
            "slt_monhoc_filter": this.options.subjectName,
            "slt_malopmonhoc_filter": this.options.subjectClassCode,
            "slt_giaovien_filter": this.options.teacher,
            "slt_thu_filter": this.options.dayOfWeek,
            "slt_giangduong_filter": this.options.lectureHall
        }
    }

    protected parse(data: string[]): ICalendar | undefined {
        if (data.length !== 12) return undefined;
        return {
            subjectCode: data[1],
            subjectName: data[2],
            credit: Number(data[3]),
            subjectClassCode: data[4],
            teacher: data[5],
            numStudent: Number(data[6]),
            sessionOfDay: data[7],
            dayOfWeek: data[8],
            session: this.parseSession(data[9]),
            lectureHall: data[10],
            group: data[11]
        }
    }

    private parseSession(text: string) {
        return text.split("-").map(item => parseInt(item));
    }

    public async craw<T = any>(): Promise<T> {
        const raw = await this.fetchData();
        if (raw) {
            const table = extractTable(raw);
            const rows = extractRow(table[3]);

            const data = rows.slice(1)
                .map(row => {
                    const columns = extractCol(row);
                    return this.parse(columns);
                })
                .filter(data => !!data);

            return this.pipeline.runPipeline<T>(data);
        }
        return [] as T;
    }
}