import { useEffect, useState } from "react";
import axios from "axios";

import { DispersalType } from "./schema";
import { columns } from "./column";
import { DispersalDataTable } from "./data-table";

export default function DispersalTable() {
  const [dispersalData, setDispersalData] = useState<DispersalType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:5000/api/dispersals/");

        if (res.status !== 200) {
          throw new Error("Failed to fetch data");
        }

        const { data } = res.data;
        setDispersalData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return <DispersalDataTable columns={columns} data={dispersalData} />;
}
