// uet-crawler - NghiaDT - 2024
import axios from 'axios';
import https from 'https';

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, key + "" , value);
class PipelineBase {
  constructor() {
    __publicField$3(this, "pipeline");
    this.pipeline = [];
  }
  addPipeline(func) {
    this.pipeline.push(func);
    return this;
  }
  runPipeline(data) {
    const value = this.pipeline.reduce((acc, func) => func(acc), data);
    return value;
  }
}

function extractTable(text) {
  return [...text.matchAll(/<table(?:.|\n)*?>((?:.|\n)*?)<\/table>/g)].map((item) => item[1]);
}
function extractRow(text) {
  return [...text.matchAll(/<tr(?:.|\n)*?>((?:.|\n)*?)<\/tr>/g)].map((item) => item[1]);
}
function extractCol(text) {
  return [...text.matchAll(/<td(?:.|\n)*?>((?:.|\n)*?)<\/td>/g)].map((item) => item[1]);
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
class BaseCrawler {
  constructor(host, pipeline, marked) {
    __publicField$2(this, "pipeline");
    __publicField$2(this, "host", "");
    __publicField$2(this, "marked", {
      table_start: 0,
      row_start: 0
    });
    this.pipeline = pipeline || new PipelineBase();
    this.host = host;
    this.marked = marked || this.marked;
  }
  async fetchData() {
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
    } catch (e) {
      console.error("Error fetching data:", e.message);
      return null;
    }
  }
  async craw() {
    const raw = await this.fetchData();
    if (raw) {
      const table = extractTable(raw);
      const rows = extractRow(table[this.marked.table_start]);
      const data = rows.slice(this.marked.row_start).map((row) => {
        const columns = extractCol(row);
        return this.parse(columns);
      }).filter((data2) => !!data2);
      return this.pipeline.runPipeline(data);
    }
    return [];
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
const _Calendar = class _Calendar extends BaseCrawler {
  constructor(options, pipeline) {
    super(_Calendar.DefaultHost, pipeline, {
      table_start: 3,
      row_start: 1
    });
    __publicField$1(this, "options");
    this.options = options || {};
  }
  mapping() {
    return {
      "slt_namhoc": this.options.semester,
      "slt_mamonhoc_filter": this.options.subjectCode,
      "slt_monhoc_filter": this.options.subjectName,
      "slt_malopmonhoc_filter": this.options.subjectClassCode,
      "slt_giaovien_filter": this.options.teacher,
      "slt_thu_filter": this.options.dayOfWeek,
      "slt_giangduong_filter": this.options.lectureHall
    };
  }
  parse(data) {
    if (data.length !== 12) return void 0;
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
    };
  }
  parseSession(text) {
    return text.split("-").map((item) => parseInt(item));
  }
};
__publicField$1(_Calendar, "DefaultHost", "http://112.137.129.115/tkb/listbylist.php");
let Calendar = _Calendar;

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const _Subject = class _Subject extends BaseCrawler {
  constructor(options, pipeline) {
    super(_Subject.DefaultHost, pipeline, {
      table_start: 0,
      row_start: 2
    });
    __publicField(this, "options");
    this.options = options || {};
  }
  mapping() {
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
    };
  }
  parse(data) {
    if (data.length !== 11) return void 0;
    return {
      student: {
        sid: data[1],
        name: data[2],
        dob: new Date(data[3].replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")),
        officialClass: data[4]
      },
      subjectCode: data[5],
      subjectName: data[6],
      group: data[7],
      credit: parseInt(data[8]),
      note: data[9],
      semester: data[10]
    };
  }
};
__publicField(_Subject, "DefaultHost", "https://112.137.129.87/qldt/");
let Subject = _Subject;

class SubjectPipeline extends PipelineBase {
  constructor() {
    super();
  }
  addAggregateBySID() {
    this.pipeline.push((data) => {
      const aggregatedBySid = data.reduce((acc, item) => {
        const { student, ...rest } = item;
        const sid = student.sid;
        if (!acc[sid]) {
          acc[sid] = {
            student,
            subjects: [{ ...rest }]
          };
        } else {
          acc[sid].subjects.push({ ...rest });
        }
        return acc;
      }, {});
      return Object.values(aggregatedBySid);
    });
    return this;
  }
}

class CalendarPipeline extends PipelineBase {
  constructor() {
    super();
  }
  addAggregateBySubjectClassCode() {
    this.pipeline.push((data) => {
      return data.reduce((acc, item) => {
        const { subjectClassCode, ...rest } = item;
        if (!acc[subjectClassCode]) {
          acc[subjectClassCode] = [rest];
        } else {
          acc[subjectClassCode].push({ ...rest });
        }
        return acc;
      }, {});
    });
    return this;
  }
  addFilterByGroup(groupName) {
    this.pipeline.push((data) => {
      const values = Object.values(data).map((subject) => subject.filter(
        (item) => item.group === groupName || item.group === "CL"
      ));
      return Object.keys(data).map((key, index) => ({ [key]: values[index] }));
    });
    return this;
  }
}

var UET = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Calendar: Calendar,
  CalendarPipeline: CalendarPipeline,
  Subject: Subject,
  SubjectPipeline: SubjectPipeline
});

export { Calendar, CalendarPipeline, Subject, SubjectPipeline, UET as default };
