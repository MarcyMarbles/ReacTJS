import { useEffect } from "react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanks } from "../../store/bankSlice";


export const BankList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banks, status, error } = useSelector((state: RootState) => state.banks);

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-10">
      <h2 className="text-white">Your Banks</h2>
      <ul>
        {Array.isArray(banks) && banks.map(bank => (
          <li key={bank.id}>
            <strong>{bank.name}</strong> — {bank.balance} {bank.currency}
          </li>
        ))}
      </ul>
    </div>
  );
};