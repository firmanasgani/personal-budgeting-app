import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "@/hooks/use-toast";


export default function Login() {
    const {toast} = useToast()
    const [form, setForm] = useState({
        username: '',
        password: '',
    })


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!form || !form.username) {
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
            return;
        }

        if(!form.password) {
            toast({
                title: "Password is required",
                description: "Please enter your password.",
            })
            return;
        }
        try {

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                window.location.href = "/";
            } else {
                const json = await res.json();
                if(json && json.message) {
                    alert(json.message);
                } else {
                    alert("Something went wrong");
                }
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred");
        }
    };




  return (
    <section className="tw-bg-gray-50 dark:tw-bg-gray-900">
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
            <form className="tw-space-y-4 md:tw-space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
                >
                  Username
                </label>
                <Input type="text" id="username" placeholder="jhon.doe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
                >
                  Password
                </label>
                <Input type="password" id="password" placeholder="********" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}/>
              </div>
            
              <Button type="submit">
                Sign in
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
