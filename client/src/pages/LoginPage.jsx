import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import AnimatedHeader from '../components/AnimatedHeader';

// Login page component
function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try{
            const response = await axios.post('/auth/login', formData);
            if (response.status === 200) {
                login(response.data.user); // Update auth context
                navigate('/'); // Redirect to home page
            }
        } 
        catch(err){
            setError(err.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex justify-center items-center">
            <div className="bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md">
                <AnimatedHeader 
                  title="Welcome back."
                  subtitle="R_eady to Synk in?"
                />
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="shadow appearance-none border border-slate-700 rounded w-full py-2 px-3 bg-slate-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                    </div>
                    <PasswordInput
                      label="Password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={true}
                      className="shadow appearance-none border border-slate-700 rounded w-full py-2 px-3 bg-slate-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {error && <p className="text-red-400 text-xs italic my-4 text-center">{error}</p>}
                    <div className="flex items-center justify-between mt-4">
                        <button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors cursor-pointer"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-400 text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;