import { Subject } from "./modules"

(async function index() {
    const subject = new Subject({name: "Nghia", semester:"041"});
    const data = await subject.craw();

    console.log(data);
    
})()