import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (data.status) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created successfully!");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.status) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Welcome back!");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token]);

  const isSignUp = state === 'Sign Up';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl flex bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Left decorative panel */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 flex-col justify-between p-10 relative overflow-hidden">
          <div className="absolute top-[-60px] left-[-60px] w-64 h-64 rounded-full bg-white opacity-5" />
          <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white opacity-5" />

          <div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Health, Our Priority</h2>
            <p className="text-blue-100 text-sm leading-relaxed">Book appointments with top doctors, get AI-powered health insights and manage your medical history.</p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { icon: "🩺", text: "Book with specialist doctors" },
              { icon: "💊", text: "Digital prescriptions" },
              { icon: "🤖", text: "AI health assistant" },
              { icon: "📋", text: "Full medical history" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-blue-100">
                <span className="text-lg">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 p-8 md:p-12">
          {/* Tab Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setState('Sign Up')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isSignUp ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Create Account
            </button>
            <button
              onClick={() => setState('Login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isSignUp ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Sign In
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {isSignUp ? "Join thousands of patients managing their health online." : "Sign in to access your appointments and medical records."}
          </p>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 transition-all ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setState(isSignUp ? 'Login' : 'Sign Up')}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isSignUp ? "Sign In" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;