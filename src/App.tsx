import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteBalance, fetchProfile, getBalance, topUpBalance, withdrawBalance } from "./store/profileSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { BankList } from "./components/bank/BankList";
import { ChartsTrans } from "./components/charts/chartsTrans";


const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const { username } = useParams<{ username: string }>();

    const { user, balance, status } = useAppSelector((state) => state.profile);
    const [amount, setAmount] = useState<string>("");

    useEffect(() => {
    if (username) {
      dispatch(fetchProfile({ username }));
      console.log(username)
    }
    }, [username, dispatch]);

    useEffect(() => {
        dispatch(getBalance());
    }, [dispatch]);

    const handleTopUp = () => {
        const parsed = parseFloat(amount);
        if (!isNaN(parsed) && parsed > 0) {
        dispatch(topUpBalance(parsed));
        }
    };

    const handleWithdraw = () => {
        const parsed = parseFloat(amount);
        if (!isNaN(parsed) && parsed > 0) {
        dispatch(withdrawBalance(parsed));
        }
    };

    if (status === "loading") return <p className="text-center mt-8">Loading...</p>;
    if (!user || !balance) return <p className="text-center mt-8 text-red-600">Failed to load dashboard data.</p>;


    return (
        <div className="h-screen w-full text-left p-2">
            <h1 className="text-3xl font-bold text-white box-content px-10 pt-10">Dashboard</h1>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white">
                <div className="text-lg space-y-2 px-10 py-4 box-content">
                    <p className="font-medium text-white"><span className="font-medium text-white">Username:</span> {user.username}</p>
                    <p className="font-medium text-white"><span className="font-medium text-white">Email:</span> {user.email}</p>
                </div>
                <div className="space-y-2">
                    <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="py-1.5 px-8 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none 
                        dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer
                        placeholder:text-gray-600 placeholder:medium placeholder:tracking-wider placeholder:font-medium"
                    />

                    <div className="flex gap-4">
                    <button
                        onClick={handleTopUp}
                        className="flex-1 transition ease-in-out duration-300 bg-transparent border border-white hover:bg-white hover:text-black text-white rounded p-2 font-semibold"
                    >
                        Top Up
                    </button>
                    <button
                        onClick={handleWithdraw}
                        className="flex-1 transition ease-in-out duration-300 bg-transparent border border-white hover:bg-white hover:text-black text-white rounded p-2 font-semibold"
                    >
                        Withdraw
                    </button>
                    </div>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-10">
                <div className="p-4 sm:p-6 xl:p-8 box-border p-8 border-neutral-100 shadow-sm shadow-neutral-100/50 border rounded-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl sm:text-3xl leading-none font-bold text-white">{balance.balance} {balance.currency}</span>
                            <h3 className="text-base font-normal text-gray-500">Your balance</h3>
                        </div>
                        <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                            <button
                            onClick={() => dispatch(deleteBalance())}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                            Delete Balance
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <BankList/>
            <ChartsTrans/>
        </div>
    );
};

export default App;