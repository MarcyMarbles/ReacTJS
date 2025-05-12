import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface LoanType {
  code: string;
  label: string;
}

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    loanerName: string; 
    loanType: string; 
    amount: number; 
    currency: string;
    approximateDate: Date;
  }) => void;
}

const LoanModal: React.FC<LoanModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [loanerName, setLoanerName] = useState<string>('');
  const [loanType, setLoanType] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');
  const [approximateDate, setApproximateDate] = useState<Date>(new Date());
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);

  useEffect(() => {
    // Fetch loan types from API
    fetch('http://localhost:8080/api/loans/loan-types')
      .then(response => response.json())
      .then(data => setLoanTypes(data))
      .catch(error => console.error('Error fetching loan types:', error));
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ loanerName, loanType, amount, currency, approximateDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-black p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Add Loan Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="loanerName">
              Loaner Name
            </label>
            <input
              type="text"
              id="loanerName"
              value={loanerName}
              onChange={(e) => setLoanerName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="loanType">
              Loan Type
            </label>
            <select
              id="loanType"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a loan type</option>
              {loanTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="currency">
              Currency
            </label>
            <input
              type="text"
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="approximateDate">
              Approximate Date
            </label>
            <DatePicker
              selected={approximateDate}
              onChange={(date: Date) => setApproximateDate(date)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanModal; 