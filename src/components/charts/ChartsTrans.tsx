import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { AppDispatch, RootState } from "../../store";
import { fetchAllTransactions } from "../../store/transactionsSlice";

export const ChartsTrans = () => {
  const dispatch = useDispatch<AppDispatch>();
  const transactions = useSelector((state: RootState) => state.transactions.data);
  const status = useSelector((state: RootState) => state.transactions.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllTransactions());
    }
  }, [dispatch, status]);

const dataByTimestamp = useMemo(() => {
  if (!Array.isArray(transactions)) return [];

  return transactions.map(tx => {
    const created = tx.createdAt;
    if (!created) return null;

    const balance = Number(tx.initialAmount) + Number(tx.amount);

    return {
      timestamp: new Date(created * 1000).toISOString(),
      balance,
      initialAmount: Number(tx.initialAmount),
      amount: Number(tx.amount),
    };
  }).filter(Boolean);
}, [transactions]);


  return (
   <LineChart width={1880} height={300} data={dataByTimestamp}>
    <XAxis dataKey="timestamp" tickFormatter={(val) => new Date(val).toLocaleTimeString()} />
    <YAxis />
    <Tooltip
        labelFormatter={(val) => new Date(val).toLocaleString()}
        formatter={(value: number, name: string) => [`${value.toFixed(2)} KZT`, name]}
    />
    <CartesianGrid stroke="#ccc" />
    <Line type="monotone" dataKey="initialAmount" stroke="#82ca9d" name="Начальный баланс" />
    <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Баланс после транзакции" />
</LineChart>
  );
};
