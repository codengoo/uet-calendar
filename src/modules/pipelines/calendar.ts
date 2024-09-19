import { ICalendar } from "../crawlers";
import { PipelineBase } from "./base";

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