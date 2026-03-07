



function TeamCardWidget() {
  return (
    <div className="flex h-full ">
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <p className="text-xs text-gray-400 ">
            {" "}
            <span>users</span>
          </p>
          <span className=" text-wrap text-center text-sm font-poppin sm:text-left">
            title
          </span>
        </div>
      </div>

      <div className="flex flex-col h-full justify-between w-20 ">
        <div className="w-full h-full"></div>

        <div className="flex flex-col text-right">
          <span className="text-xs">Authority</span>
     
        </div>
      </div>
    </div>
  );
}

export default TeamCardWidget;
