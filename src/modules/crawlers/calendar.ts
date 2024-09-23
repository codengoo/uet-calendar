import { BaseCrawler } from "./base";
import { CalendarPipeline } from "../pipelines";

export interface ICalendar extends Omit<Required<ICalendarOption>, "semester"> {
    credit: number;
    numStudent: number;
    session: number[];
    sessionInHour: number[];
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

export class Calendar extends BaseCrawler {
    public static readonly DefaultHost: string = "http://112.137.129.115/tkb/listbylist.php";
    private options: ICalendarOption;

    constructor(options?: ICalendarOption, pipeline?: CalendarPipeline) {
        super(Calendar.DefaultHost, pipeline, {
            table_start: 3,
            row_start: 1
        });
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
            sessionInHour: this.parseSession(data[9], 6),
            lectureHall: data[10],
            group: data[11]
        }
    }

    private parseSession(text: string, pad: number = 0) {
        return text.split("-").map(item => parseInt(item) + pad);
    }
}