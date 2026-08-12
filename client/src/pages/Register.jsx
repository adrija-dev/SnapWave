import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const Register = () => {
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await register(username, email, password);

      toast.success("Registration successful! Please login.");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">

      {/* Background */}
      <img
        src={assets.bgImage}
        alt=""
        className="absolute top-0 left-0 z-[-1] w-full h-full object-cover"
      />

      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40">

        <img
          src={assets.logo}
          alt="SnapWave"
          className="h-12 object-contain"
        />

        <div>

          <div className="flex items-center gap-3 mb-4 max-md:mt-10">

            <img
              src={assets.group_users}
              alt=""
              className="h-8 md:h-10"
            />

            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 md:w-4.5 md:h-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>

              <p>Used by 10k+ developers</p>
            </div>

          </div>

          <h1 className="text-2xl md:text-4xl md:pb-1 font-bold bg-linear-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            Make Connections Throughout the World!
          </h1>

          <p className="text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md">
            Connect with global community on SnapWave
          </p>

        </div>

        <span className="md:h-10"></span>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">

        <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">

          <div className="p-8">

            <h2 className="text-2xl font-bold text-center text-gray-800">
              Create your SnapWave account
            </h2>

            <p className="text-center text-gray-500 text-sm mt-2 mb-7">
              Join the global community today
            </p>

            <form onSubmit={handleRegister}>

              {/* Username */}
              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

              </div>

              {/* Email */}
              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

              </div>

              {/* Password */}
              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

              </div>

              {/* Register */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account  ▸"}
              </button>

            </form>

          </div>

          {/* Login */}
          <div className="border-t border-gray-200 p-5 text-center text-sm text-gray-600">

            Already have an account?

            <a
              href="/"
              className="text-indigo-600 font-medium ml-1 hover:underline"
            >
              Sign in
            </a>

          </div>

          <div className="border-t border-gray-200 p-4 text-center text-xs text-gray-400">
            Secured by SnapWave
          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;