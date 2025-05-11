import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "../../api/api";


interface LoginResponse {
  token: string;
  role: string;
  id: string;
  username: string;
}

interface FormData {
  login: string;
  password: string;
}

const initialFormData: FormData = {
  login: '',
  password: ''
};

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(apiLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const { token, role, id, username }: LoginResponse = await response.json();

      Cookies.set("token", token, { expires: 30 });
      Cookies.set("role", role, { expires: 30 });
      Cookies.set("id", id, { expires: 30 });
      Cookies.set("username", username, { expires: 30 });

      navigate(role.includes("ROLE_ADMIN") ? "/admin" : `/profile/${username}`);
    } catch (err: any) {
      setError(err.message || "Login failed");
      console.log(error)
    }
  };

  return (
  <section className="mt-48">
    <form className="max-w-md mx-auto border border-neutral-100 shadow-md shadow-neutral-100/50 rounded-md box-border p-8" onSubmit={handleLogin}>
      <h3 className="mb-8 text-xl tracking-wider text-white">LOGIN</h3>

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
          type="password" 
          name="password" 
          className="block py-2.5 px-0 w-full mb-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer" 
          placeholder=" " 
          required
          autoComplete="new-password"
          value={formData.password || ""}
          onChange={handleChange} />
          <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-violet-600 peer-focus:dark:text-violet-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
      </div>

      <div className="relative z-0 w-full mb-2 group">
        <button type="submit" className="text-white bg-violet-500 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 mt-8 text-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800">Log in</button>
      </div>
      
    </form>
  </section>
  );
};

export default LoginPage;