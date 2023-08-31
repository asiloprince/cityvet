function Overview() {
  return (
    <div className="max-w-7xl mx-5 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Home</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow h-24"> Box 1</div>

        <div className="bg-white rounded-lg p-4 shadow h-24"> Box 2</div>

        <div className="bg-white rounded-lg p-4 col-span-1 row-span-2 shadow">
          Box 3
        </div>

        <div className="bg-white rounded-lg p-4 shadow h-24"> Box 4</div>

        <div className="bg-white rounded-lg p-4 shadow h-24"> Box 5</div>

        <div className="bg-white rounded-lg p-4 col-span-2 row-span-6 h-72 shadow">
          Box 6
        </div>

        <div className="bg-white rounded-lg p-4 col-span-1 row-span-6 h-72 shadow">
          Box 7
        </div>
      </div>
    </div>
  );
}

export default Overview;
