import UET from "@nghiavuive/uet-course"

(async () => {
  const pipeline = new UET.SubjectPipeline();
  pipeline.addAggregateBySID();

  const subject = new UET.Subject({name: "Nghia", semester: "041"}, pipeline);
  const data = await subject.craw();

  console.log(data);
  
})()
