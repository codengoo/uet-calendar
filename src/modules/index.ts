import axios from "axios";
import https from "https";
import { Subject } from "../models/subject";

export async function getData() {
    try{
        const instance = axios.create({
            httpsAgent: new https.Agent({  
              rejectUnauthorized: false
            })
          });
    
        const response = await instance.get("https://112.137.129.87/qldt/?SinhvienLmh%5BmasvTitle%5D=&SinhvienLmh%5BhotenTitle%5D=&SinhvienLmh%5BngaysinhTitle%5D=&SinhvienLmh%5BlopkhoahocTitle%5D=a&SinhvienLmh%5BtenlopmonhocTitle%5D=&SinhvienLmh%5BtenmonhocTitle%5D=&SinhvienLmh%5Bnhom%5D=&SinhvienLmh%5BsotinchiTitle%5D=&SinhvienLmh%5Bghichu%5D=&SinhvienLmh%5Bterm_id%5D=040&SinhvienLmh_page=1&ajax=sinhvien-lmh-grid");
        return response.data;
    } catch (e: any) {
        console.error("Error fetching data:", e.message);
        return null;
    }
}

export function ParseData(data: string[]): Subject{
  return {
    student: {
      sid: data[1],
      name: data[2],
      dob: new Date(data[3].replace(/(\d{2})\/(\d{2})\/(\d{4})/,"$2/$1/$3")),
      officialClass: data[4],
    },
    subjectCode: data[5],
    subjectName: data[6],
    group: data[7],
    credit: parseInt(data[8]),
    note: data[9],
    semester: data[10]
  }
}