import { BaseCrawler } from "./base";
import { SubjectPipeline } from "../pipelines";

export interface Student {
  sid: string;
  name: string;
  dob: Date;
  officialClass: string;
}

export interface ISubject {
  student: Student,
  subjectCode: string,
  subjectName: string,
  group: string,
  credit: number,
  note: string,
  semester: string
}

export interface ISubjectOption {
  sid?: string,
  name?: string,
  dob?: string,
  officialClass?: string,
  subjectCode?: string,
  subjectName?: string,
  group?: string,
  credit?: number,
  note?: string,
  semester?: string
}

export class Subject extends BaseCrawler {
  public static readonly DefaultHost: string = "https://112.137.129.87/qldt/";
  private options: ISubjectOption;

  constructor(options?: ISubjectOption, pipeline?: SubjectPipeline) {
    super(Subject.DefaultHost, pipeline, {
      table_start: 0,
      row_start: 2
    });
    this.options = options || {};
  }

  protected mapping() {
    return {
      "SinhvienLmh[masvTitle]": this.options.sid,
      "SinhvienLmh[hotenTitle]": this.options.name,
      "SinhvienLmh[ngaysinhTitle]": this.options.dob,
      "SinhvienLmh[lopkhoahocTitle]": this.options.officialClass,
      "SinhvienLmh[tenlopmonhocTitle]": this.options.subjectCode,
      "SinhvienLmh[tenmonhocTitle]": this.options.subjectName,
      "SinhvienLmh[nhom]": this.options.group,
      "SinhvienLmh[sotinchiTitle]": this.options.credit,
      "SinhvienLmh[ghichu]": this.options.note,
      "SinhvienLmh[term_id]": this.options.semester
    }
  }

  protected parse(data: string[]): ISubject | undefined {
    if (data.length !== 11) return undefined;
    return {
      student: {
        sid: data[1],
        name: data[2],
        dob: new Date(data[3].replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")),
        officialClass: data[4],
      },
      subjectCode: data[5],
      subjectName: data[6],
      group: data[7],
      credit: parseInt(data[8]),
      note: data[9],
      semester: data[10]
    }
  }
}