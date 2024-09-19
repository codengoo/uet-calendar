import axios from "axios";
import https from "https";
import { PipelineBase } from "../pipelines/base";
import { extractCol, extractRow, extractTable } from "../../utils";

interface IMarked {
    table_start: number;
    row_start: number;
}

export abstract class BaseCrawler {
    private readonly pipeline: PipelineBase;
    private readonly host: string = "";
    private readonly marked: IMarked = {
        table_start: 0,
        row_start: 0
    }

    constructor(host: string, pipeline?: PipelineBase, marked?: IMarked) {
        this.pipeline = pipeline || new PipelineBase();
        this.host = host;
        this.marked = marked || this.marked;
    }

    protected async fetchData() {
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

    public async craw<T = any>(): Promise<T> {
        const raw = await this.fetchData();
        if (raw) {
            const table = extractTable(raw);
            const rows = extractRow(table[this.marked.table_start]);
            const data = rows.slice(this.marked.row_start)
                .map(row => {
                    const columns = extractCol(row);
                    return this.parse(columns);
                })
                .filter(data => !!data);

            return this.pipeline.runPipeline<T>(data);
        }
        return [] as T;
    }

    protected abstract mapping(): object;
    protected abstract parse(data: any): any;
}