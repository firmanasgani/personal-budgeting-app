import {  useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/authContext";
import { authLogin } from "@/api/auth";
import { Bounce, ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });


  const { login } = useAuth()

  const token = localStorage.getItem('authToken')
  if(token != null) {
    return <Navigate to="/dashboard" />
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
   
    try {
      const formData = new FormData();
      if (!form || !form.username) {
        toast.error('Username still blank', {
          position: "bottom-right"
        })
        return;
      }
  
      if (!form.password) {
        toast.error('Password still blank', {
          position: "bottom-right"
        })
        return;
      }
      formData.append("username", form.username);
      formData.append("password", form.password);
      const response = await authLogin(formData);
      // Handle successful login
     
      localStorage.setItem("refreshToken", response.refresh_token);
      localStorage.setItem("userData", JSON.stringify(response.users));
      toast.success('Login succes! You will redirect to Dashboard', {
        position: "bottom-right",
        theme: 'colored',
        transition: Bounce
      })
      setTimeout(() => {
        login(response.access_token)

      }, 5000)
    } catch (error: any) {
      if (error.response.status === 404 || error.response.status === 400) {
        toast.error('Login failed, please check your credentials', {
          position: "bottom-right",
          theme: "colored",
          transition: Bounce
        })
      } else if (error.response.status === 500) {
        toast.error('Internal server error. Please try again later', {
          position: "bottom-right",
          transition: Bounce,
          theme: "colored"
        })
      }else {
        toast.error('Server error, please try again later', {
          position: 'bottom-right',
          transition: Bounce,
          theme: 'colored'
        })
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tw-bg-gray-50 dark:tw-bg-gray-900">
      <ToastContainer autoClose={2500} />
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-6 tw-py-8 tw-mx-auto md:tw-h-screen lg:tw-py-0">
        <a
          href="#"
          className="tw-flex tw-items-center tw-mb-6 tw-text-2xl tw-font-semibold tw-text-gray-900 dark:tw-text-white"
        >
          Personal Budget
        </a>
        <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow dark:tw-border md:tw-mt-0 sm:tw-max-w-md xl:tw-p-0 dark:tw-bg-gray-800 dark:tw-border-gray-700">
          <div className="tw-p-6 tw-space-y-4 md:tw-space-y-6 sm:tw-p-8">
            <h1 className="tw-text-xl tw-font-bold tw-leading-tight tw-tracking-tight tw-text-gray-900 md:tw-text-2xl dark:tw-text-white">
              Sign in to your account
            </h1>
            <form
              className="tw-space-y-4 md:tw-space-y-6"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="username"
                  className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
                >
                  Username
                </label>
                <Input
                  type="text"
                  id="username"
                  placeholder="jhon.doe"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
                >
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  placeholder="********"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-2 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                      ></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <p className="tw-text-sm tw-font-light tw-text-gray-500 dark:tw-text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="/register"
                  className="tw-font-medium tw-text-primary-600 hover:tw-underline dark:tw-text-primary-500"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
