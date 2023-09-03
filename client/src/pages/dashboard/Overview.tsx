import CardWidget from "../../components/cards/CardWidget";
import {
  chartBoxDispersal,
  chartBoxLivestocks,
  chartBoxRedispersal,
  chartBoxUser,
} from "../../utils/keyMetrics";

function Overview() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto lg:h-27">
          <CardWidget {...chartBoxUser} />
        </div>

        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto lg:h-27">
          <CardWidget {...chartBoxDispersal} />
        </div>

        <div className="bg-white rounded-lg p-4 col-span-2 md:col-span-1 row-span-2 shadow h-full">
          Box 3
        </div>

        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto lg:h-27">
          <CardWidget {...chartBoxLivestocks} />
        </div>

        <div className="bg-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto lg:h-27">
          <CardWidget {...chartBoxRedispersal} />
        </div>

        <div className="bg-white rounded-lg p-4 col-span-2 row-span-4 lg:col-span-2 lg:row-span-6  h-72 shadow">
          Recent Activity
        </div>

        <div className="bg-white rounded-lg p-4 col-span-2 lg:col-span-1 row-span-4 h-72 shadow">
          Box 7
        </div>
      </div>
    </div>
  );
}

export default Overview;
