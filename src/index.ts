import { Calendar, CalendarPipeline } from "./modules"

(async function index() {
  const pipeline = new CalendarPipeline();
  pipeline
    .addAggregateBySubjectClassCode()
    .addFilterByGroup("2");

  const calendar = new Calendar({ subjectName: "3261" }, pipeline)
  const data = await calendar.craw()

  console.log(data[0]);

})()