import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiBalance, apiLogin, apiRegister } from "../../api/api";

interface LoginResponse {
  token: string;
  role: string;
  id: string;
  username: string;
}

interface FormData {
  username: string;
  login: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const initialFormData: FormData = {
  username: '',
  login: '',
  email: '',
  password: '',
  password_confirmation: '',
};

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirmation) {
      setError("Please, confirm your password correctly!");
      return;
    }

    try {
      const { username, login, email, password } = formData;

      const response = await fetch(apiRegister, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username,
                    login,
                    email,
                    password,
                }),
            });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Registration failed");
      }

      console.log(await response.text());

      const loginRes = await fetch(apiLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (!loginRes.ok) {
        throw new Error("Auto login failed after registration");
      }

      const { token, username: registeredUsername }: LoginResponse = await loginRes.json();
      Cookies.set("token", token, { expires: 30 });
      Cookies.set("username", registeredUsername, { expires: 30 });

      const balanceResponse = await fetch(apiBalance, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currency: "KZT" }),
      });

      console.log("Registered user:", response.formData);
      console.log(token)

      if (balanceResponse.status !== 200 && balanceResponse.status !== 409) {
        const text = await balanceResponse.text();
        throw new Error(text || "Balance creation failed");
      }

      navigate("/successful");
    } catch (err: any) {
      setError(err.message || "Registration failed");
      console.log(error)
    }
  };

  return (
    <section className="mt-20">
      <form className="max-w-md mx-auto border border-neutral-100 shadow-md shadow-neutral-100/50 rounded-md box-border p-8" onSubmit={handleRegister}>
        <h3 className="mb-8 text-xl tracking-wider text-white">REGISTRATION</h3>

        <div className="relative z-0 w-full mb-4 group">
          <input 
            type="text"
            name="login"
            required 
            value={formData.login} 
            onChange={handleChange} 
            className="block py-2.5 px-0 w-full text-xl text-gray-900 bg-transparent border-0 mb-2 border-b-2 border-gray-300
            appearance-none dark:text-white dark:border-gray-100 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer"
            placeholder=" " 
            autoComplete="off"
          />
          <label htmlFor="login" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-violet-600 peer-focus:dark:text-violet-500A peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Login</label>
        </div>

        <div className="relative z-0 w-full mb-4 group">
          <input 
            type="text"
            name="username"
            required 
            value={formData.username} 
            onChange={handleChange} 
            className="block py-2.5 px-0 w-full text-xl text-gray-900 bg-transparent border-0 mb-2 border-b-2 border-gray-300
            appearance-none dark:text-white dark:border-gray-100 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer"
            placeholder=" " 
            autoComplete="off"
          />
          <label htmlFor="username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-violet-600 peer-focus:dark:text-violet-500A peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
        </div>

        <div className="relative z-0 w-full mb-4 group">
          <input 
            type="text"
            name="email"
            required 
            value={formData.email} 
            onChange={handleChange} 
            className="block py-2.5 px-0 w-full text-xl text-gray-900 bg-transparent border-0 mb-2 border-b-2 border-gray-300
            appearance-none dark:text-white dark:border-gray-100 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer"
            placeholder=" " 
            autoComplete="off"
          />
          <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-violet-600 peer-focus:dark:text-violet-500A peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
        </div>

        <div className="relative z-0 w-full mb-4 group">
          <input 
            type="password"
            name="password"
            required 
            value={formData.password} 
            onChange={handleChange} 
            className="block py-2.5 px-0 w-full text-xl text-gray-900 bg-transparent border-0 mb-2 border-b-2 border-gray-300
            appearance-none dark:text-white dark:border-gray-100 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer"
            placeholder=" " 
            autoComplete="new-password"
          />
          <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-violet-600 peer-focus:dark:text-violet-500A peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
        </div>

        <div className="relative z-0 w-full mb-4 group">
          <input 
            type="password"
            name="password_confirmation"
            required 
            value={formData.password_confirmation} 
            onChange={handleChange} 
            className="block py-2.5 px-0 w-full text-xl text-gray-900 bg-transparent border-0 mb-2 border-b-2 border-gray-300
            appearance-none dark:text-white dark:border-gray-100 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer"
            placeholder=" " 
            autoComplete="off"
          />
          <label htmlFor="password_confirmation" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-violet-600 peer-focus:dark:text-violet-500A peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
        </div>

        <button type="submit" className="text-white bg-violet-500 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 mt-8 text-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800">
          Sign up
        </button>
      </form>
    </section>
  );
};

export default RegisterPage;