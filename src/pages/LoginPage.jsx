import { useState, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signIn } from "../api/axios";
import toast from "react-hot-toast";
import "../styles/CustomStyle.css";
import { useMutation } from "@tanstack/react-query";
import eyeIcon from "../assets/pictures/eye-icon.svg";
import eyeOff from "../assets/pictures/eye-off.svg";

const LoginPage = () => {
  const { auth, login, isVerifying } = useAuth();
  const loginRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(null);
  const [toastShown, setToastShown] = useState(false); // Track if toast is shown

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const signInMutation = useMutation({
    mutationFn: ({ username, password }) => signIn({ username, password }),
    onSuccess: (data) => {
      login(data);
      navigate(from, { replace: true });
      toast.success("İstifadəçi daxil oldu", { duration: 1000 });
    },
    onError: (error) => {
      if (!toastShown) {
        setToastShown(true);
        if (!error?.response)
          toast.error("Server cavab vermir", { duration: 1500 });
        else if (error?.response?.status === 400)
          toast.error("İstifadəçi adı və ya şifrə daxil olunmayıb", {
            duration: 1500,
          });
        else if (error?.response?.status === 401)
          toast.error("Yalnış istifadəçi adı və ya şifrə", { duration: 1500 });
        else toast.error("Error, səhifəni yeniləyin", { duration: 1500 });
        //Delay before allowing next toast
        setTimeout(() => {
          setToastShown(false);
        }, 1600);
      }
    },
  });

  // Form submit handle function
  const handleSubmit = async (e) => {
    e.preventDefault();
    signInMutation.mutate({
      username: loginRef.current.value,
      password: passwordRef.current.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {!isVerifying && auth?.isAuth && <Navigate to="/" />}
      {!isVerifying && !auth?.isAuth && (
        <div className="flex h-screen items-center justify-center bg-gray-200">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-xl bg-white p-8 shadow-md"
          >
            <h2 className="mb-4 text-center text-xl text-gray-500">Sign in</h2>
            <label htmlFor="username" className="font-bold">
              Username
            </label>
            <input
              required
              autoComplete="off"
              ref={loginRef}
              id="username"
              type="text"
              placeholder="Enter your username"
              className="login-input"
            />

            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <div className="relative">
              <input
                required
                ref={passwordRef}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="login-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-3.5 cursor-pointer"
              >
                <img
                  src={showPassword ? eyeOff : eyeIcon}
                  className="h-auto w-7 text-gray-300"
                />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-2 w-full cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-base text-white transition duration-300 ease-in-out hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LoginPage;
