import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  // Form state
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  // Check password strength
  const checkPasswordStrength = (pwd) => {
    const requirements = {
      minLength: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*]/.test(pwd),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    return { score, requirements };
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (state === "register") {
      setPasswordStrength(checkPasswordStrength(pwd));
    }
  };

  // Handle form submission
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      // Validation for register
      if (state === "register") {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        const { score, requirements } = checkPasswordStrength(password);
        if (score < 5) {
          toast.error("Password must meet all requirements");
          return;
        }
      }

      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        // Set token BEFORE navigation
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = data.token;
        setToken(data.token);
        setShowLogin(false);
        // Navigate after token is set
        navigate("/");
      } else {
        if (data.maintenanceMode) {
          toast.error(data.message);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    // Overlay background
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 left-0 right-0 bottom-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
    >
      {/* Modal form */}
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 !m-auto items-start !p-8 !py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        {/* Heading */}
        <p className="text-2xl font-medium !m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Name (register only) */}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter name"
              className="border border-gray-200 rounded w-full !p-2 !mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter email"
            className="border border-gray-200 rounded w-full !p-2 !mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <p>Password</p>
          <div className="relative">
            <input
              onChange={handlePasswordChange}
              value={password}
              placeholder="Enter password"
              className="border border-gray-200 rounded w-full !p-2 !mt-1 outline-primary"
              type={showPassword ? "text" : "password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-black hover:text-gray-700 cursor-pointer flex items-center"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M15.171 13.576l1.414 1.414A2 2 0 0016.414 13M9.172 17.025a9.960 9.960 0 001.828.14 10.014 10.014 0 004.512-1.074l1.78 1.781A1 1 0 0015.414 18.22l-14-14a1 1 0 10-1.414 1.414l2.171 2.171A10 10 0 009.172 17.025z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator (register only) */}
        {state === "register" && password && (
          <div className="w-full bg-gray-50 !p-3 rounded">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Password Requirements:
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    passwordStrength.requirements?.minLength
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {passwordStrength.requirements?.minLength ? "✓" : "○"} At
                  least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    passwordStrength.requirements?.uppercase
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {passwordStrength.requirements?.uppercase ? "✓" : "○"} One
                  uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    passwordStrength.requirements?.lowercase
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {passwordStrength.requirements?.lowercase ? "✓" : "○"} One
                  lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    passwordStrength.requirements?.number
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {passwordStrength.requirements?.number ? "✓" : "○"} One number
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    passwordStrength.requirements?.special
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {passwordStrength.requirements?.special ? "✓" : "○"} One
                  special character (!@#$%^&*)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Password (register only) */}
        {state === "register" && (
          <div className="w-full">
            <p>Confirm Password</p>
            <div className="relative">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                placeholder="Confirm password"
                className="border border-gray-200 rounded w-full !p-2 !mt-1 outline-primary"
                type={showConfirmPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-black hover:text-gray-700 cursor-pointer flex items-center"
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M15.171 13.576l1.414 1.414A2 2 0 0016.414 13M9.172 17.025a9.960 9.960 0 001.828.14 10.014 10.014 0 004.512-1.074l1.78 1.781A1 1 0 0015.414 18.22l-14-14a1 1 0 10-1.414 1.414l2.171 2.171A10 10 0 009.172 17.025z" />
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>
        )}

        {/* Toggle mode */}
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => {
                setState("login");
                setPassword("");
                setConfirmPassword("");
                setPasswordStrength({ score: 0, feedback: [] });
              }}
              className="text-primary cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => {
                setState("register");
                setPassword("");
                setConfirmPassword("");
                setPasswordStrength({ score: 0, feedback: [] });
              }}
              className="text-primary cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        )}

        {/* Submit */}
        <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full !py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
