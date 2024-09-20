const UET = require("@nghiavuive/uet-calendar");

(async () => {
    const pipeline = new UET.SubjectPipeline();
    pipeline.addAggregateBySID();

    const subject = new UET.Subject({name: "Nghia", semester: "041"}, pipeline);
    const data = await subject.craw();

    console.log(data);
})()
