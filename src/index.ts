import { getData, ParseData } from "./modules"
import { extractCol, extractRow, extractTable } from "./utils";

(async function index() {
    const raw = await getData();
    const table = extractTable(raw);
    const rows = extractRow(table[0]);
    const columns = extractCol(rows[2]);
    const data = ParseData(columns);

    console.log(data);
})()