export class PipelineBase {
  protected pipeline: ((data: any) => any)[];

  constructor() {
    this.pipeline = [];
  }

  public addPipeline(func: (data: any[]) => any[]): this {
    this.pipeline.push(func);

    return this;
  }

  public runPipeline<T = any>(data: any[]): T {
    const value = this.pipeline.reduce((acc, func) => func(acc), data);
    return value as T;
  }
}