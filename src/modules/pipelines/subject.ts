import { ISubject } from "../crawlers";
import { PipelineBase } from "./base";

export interface SubjectStudent {
  student: {
    sid: string
  },
  subjects: Omit<ISubject, "student">[]
}

export class SubjectPipeline extends PipelineBase {
  constructor() {
    super();
  }

  public addAggregateBySID(): this {
    this.pipeline.push((data: ISubject[]): SubjectStudent[] => {

      const aggregatedBySid = data.reduce((acc, item) => {
        const { student, ...rest } = item;
        const sid = student.sid

        if (!acc[sid]) {
          acc[sid] = {
            student: student,
            subjects: [{ ...rest }]
          };
        } else {
          acc[sid].subjects.push({ ...rest });
        }
        return acc;
      }, {} as Record<string, SubjectStudent>);

      return Object.values<SubjectStudent>(aggregatedBySid);
    });

    return this;
  }
}