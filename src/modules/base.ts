import axios from "axios";
import https from "https";
import { PipelineBase } from "./pipeline";

export abstract class BaseCrawler {
    protected readonly pipeline: PipelineBase;
    protected readonly host: string = "";

    constructor(host: string, pipeline?: PipelineBase) {
        this.pipeline = pipeline || new PipelineBase();
        this.host = host;
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

    protected abstract mapping(): object;
    public abstract craw<T = any>(): Promise<T>;
    protected abstract parse(data: any): any;
}