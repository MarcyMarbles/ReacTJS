import React, {useState, useEffect} from 'react';
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;

interface SalaryType {
    id: number;
    name: string;
}

interface SalaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { salary: number; salaryType: string; currency: string }) => void;
}

const SalaryModal: React.FC<SalaryModalProps> = ({isOpen, onClose, onSubmit}) => {
    const [salary, setSalary] = useState<number>(0);
    const [salaryType, setSalaryType] = useState<string>();
    const [currency, setCurrency] = useState<string>('');
    const [salaryTypes, setSalaryTypes] = useState<SalaryType[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/salary-details/get-salary-types')
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                const formatted = data.map((name: string, index: number) => ({
                    id: index + 1,
                    name
                }));
                setSalaryTypes(formatted);
            })

            .catch(error => console.error('Error fetching salary types:', error));
    }, []);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({salary, salaryType, currency});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="bg-black p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-white">Add Salary Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="salary">
                            Salary
                        </label>
                        <input
                            type="number"
                            id="salary"
                            value={salary}
                            onChange={(e) => setSalary(Number(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="salaryType">
                            Salary Type
                        </label>
                        <select
                            id="salaryType"
                            value={salaryType}
                            onChange={(e) => setSalaryType((e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Select a salary type</option>
                            {salaryTypes.map((type) => (
                                <option key={type.id} value={type.name}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
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

export default SalaryModal; 