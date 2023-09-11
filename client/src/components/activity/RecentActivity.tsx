import { Link } from "react-router-dom";
import { LiaFilterSolid } from "react-icons/lia";
import { DispersedActivity } from "../../sampledata/recentActivity";
function RecentActivity() {
  return (
    <div className=" mx-auto bg-white-100 rounded-md">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl text-gray-500 ">Recent Activity</h1>
        <div className="flex mb-3">
          <button className="border bg-gray-50 text-gray-600 text-xs rounded-md flex items-center justify-center mr-2 p-2">
            Filter <LiaFilterSolid size={14} />
          </button>
          <button className="border rounded-md p-2 text-xs text-gray-600  bg-gray-50">
            View All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w[540px]">
          <thead>
            <tr>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                Recipients
              </th>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                Livestock Recieved
              </th>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                Date
              </th>
              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">
                Barangay
              </th>
            </tr>
          </thead>
          <tbody>
            {DispersedActivity.slice(0, 5).map((activity) => (
              <tr key={activity.id}>
                <td className="py-2 px-2 border-b border-b-gray-50">
                  <div className="flex items-center">
                    <img
                      src="data:image/png;base64,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"
                      alt=""
                      className="w-8 h-8 rounded-full object-cover block"
                    />
                    <Link
                      to="#"
                      className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                    >
                      {activity.name}
                    </Link>
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <span className="text-[13px] font-medium text-gray-400">
                    {activity.livestock}
                  </span>
                </td>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <span className="text-[13px] font-medium text-gray-400">
                    {activity.DispersalDate}
                  </span>
                </td>
                <td className="py-2 px-4 border-b border-b-gray-50">
                  <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                    {activity.barangay}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentActivity;
