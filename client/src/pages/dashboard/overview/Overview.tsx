import CardWidget from "../../../components/card-widgets/CardWidget";
import RecentActivity from "../../../components/activity/RecentActivity";

import {
  chartBoxDispersal,
  chartBoxLivestocks,
  chartBoxRedispersal,
  chartBoxUser,
} from "../../../components/card-widgets/keyMetrics";
import CardWidgetPie from "../../../components/card-widgets/CardWidgetPie";

function Overview() {
  return (
    <div className="m-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto">
          <CardWidget {...chartBoxUser} />
        </div>

        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto border-r-4 border-teal-500">
          <CardWidget {...chartBoxDispersal} />
        </div>

        <div className="bg-white rounded-lg p-4 col-span-3 md:col-span-1 row-span-2 shadow h-auto">
          <CardWidgetPie />
        </div>

        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto">
          <CardWidget {...chartBoxLivestocks} />
        </div>

        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto border-r-4 border-teal-500">
          <CardWidget {...chartBoxRedispersal} />
        </div>

        <div className="bg-white rounded-lg p-4 col-span-3 row-span-4 lg:col-span-2 lg:row-span-6  h-auto shadow">
          <RecentActivity />
        </div>

        <div className="bg-white rounded-lg p-4 col-span-3 md:col-span-1 row-span-4 h-auto shadow">
          Box 7
        </div>
      </div>
    </div>
  );
}

export default Overview;
