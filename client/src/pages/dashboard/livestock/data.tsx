import { useEffect, useState } from "react";
import axios from "axios";

import { columns } from "./column";
import { LivestockDataTable } from "./data-table";

import { LivestocksType } from "./livestockschema";

export default function LivestockTable() {
  const [livestocksData, setLivestocksData] = useState<LivestocksType[]>([]);

  useEffect(() => {
    async function fetchLivestockData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/api/livestocks`,
          { withCredentials: true }
        );

        if (res.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        const { data } = res.data;
        console.log(data);
        setLivestocksData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchLivestockData();
  }, []);

  return <LivestockDataTable columns={columns} data={livestocksData} />;
}
