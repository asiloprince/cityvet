import RecentActivity from "../../../components/activity/RecentActivity";

import {
  chartBoxDispersal,
  chartBoxLivestocks,
  chartBoxRedispersal,
  chartBoxUser,
} from "../../../components/card-widgets/keyMetrics";
import CardWidgetPie from "../../../components/card-widgets/CardWidgetPie";
import BeneficiariesWidgets from "../../../components/card-widgets/BeneficiariesWidgets";
import TotalBeneficiariesWidgets from "../../../components/card-widgets/TotalBeneficiariesWidgets";
import TotalLivestoksWidgets from "../../../components/card-widgets/TotalLivestocksWidgets";
import TotalDisperseLivestocksWidgets from "../../../components/card-widgets/TotalDisperseLivestocksWidgets";
import TotalRedisperseLivestocksWidgets from "../../../components/card-widgets/TotalRedisperseLivestocksWidgets";

function Overview() {
  return (
    <div className="m-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-teal-400 text-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto">
          <TotalBeneficiariesWidgets {...chartBoxUser} />
        </div>

        <div className="bg-gray-800 text-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto border-r-4 border-teal-500">
          <TotalLivestoksWidgets {...chartBoxLivestocks} />
        </div>

        <div className="bg-white rounded-lg p-4 col-span-3 md:col-span-1 row-span-2 shadow h-auto">
          <CardWidgetPie />
        </div>

        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto">
          <TotalDisperseLivestocksWidgets {...chartBoxDispersal} />
        </div>
        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto border-r-4 border-teal-500">
          <TotalRedisperseLivestocksWidgets {...chartBoxRedispersal} />
        </div>

        <div className="flex col-span-full md:col-span-2">
          <div className="bg-white rounded-lg p-6 w-full min-h-[24rem] max-h-auto shadow">
            <RecentActivity />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 col-span-full md:col-span-1 min-h-[24rem] max-h-auto shadow">
          <BeneficiariesWidgets />
        </div>
      </div>
    </div>
  );
}

export default Overview;
