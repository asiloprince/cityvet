import Progress_bar from "./progress_bar";

const Expenses = [
    {
        name: 'Snacks',
        percentage : Number((1234/2450*100).toFixed(2)),
    },
    {
        name: 'Meals',
        percentage : Number((1100/2450*100).toFixed(2)),
    },
    {
        name: 'Transporation',
        percentage : Number((166/2450*100).toFixed(2)),
    },
]
const QuickAccess = () => {
    return(
        <>
        <div>
            <div className="flex justify-between mt-10">
                <p>Expense 2024</p>
                <p className="font-bold">2450</p>
            </div>
            <div>
                {Expenses.map((expenses, i) =>{
                    return(
                        <>
                            <div
                            key={i}
                            className="">
                                <div className="flex justify-between w-auto p-2">
                                    <div>{expenses.name}</div>
                                    <div className="mr-4">
                                        <Progress_bar bgcolor="orange"
                                        progress={expenses.percentage}
                                        height ={5}/>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                })}
            </div>
        </div>
        </>
    );
};
export default QuickAccess