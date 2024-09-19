import axios from "axios";
import https from "https";
import { Student } from "../models/student";
import { extractCol, extractRow, extractTable } from "../utils";

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

export class Subject {
  private readonly host: string = "https://112.137.129.87/qldt";
  private options: ISubjectOption;

  constructor(options?: ISubjectOption) {
    this.options = options || {};
  }

  private async fetchData() {
    try {
      const instance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      const response = await instance.get(this.host, {
        params: this.mapping()
      });

      return response.data;
    } catch (e: any) {
      console.error("Error fetching data:", e.message);
      return null;
    }
  }

  private mapping(){
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

  private parse(data: string[]): ISubject | undefined {
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

  public async craw() {
    const raw = await this.fetchData();
    if (raw) {
      const table = extractTable(raw);
      const rows = extractRow(table[0]);

      return rows.slice(2)
        .map(row => {
          const columns = extractCol(row);
          return this.parse(columns);
        })
        .filter(data => !!data);
    }
    return null;
  }
}