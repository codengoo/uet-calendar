import { Subject, PipelineBase, SubjectStudent, SubjectPipeline } from "./modules"

(async function index() {
    const pipeline = new SubjectPipeline();
    pipeline.addAggregateBySID();

    const subject = new Subject({sid: "2202832", semester:"041"}, pipeline);
    const data = await subject.craw<SubjectStudent[]>();

    console.log(data[0]);
    
})()