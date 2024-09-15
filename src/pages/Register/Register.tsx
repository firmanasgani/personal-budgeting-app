import { authRegister } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        fullname: '',
        password: '',
        confirmPassword: ''
    })

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(form.password !== form.confirmPassword) {
            alert('Password dan konfirmasi password tidak sama')
            return
        }

        const formData = new FormData()
        formData.append('username', form.username)
        formData.append('fullname', form.fullname)
        formData.append('password', form.password)
        const response =await authRegister(formData)

        if(response.status === 201) {
          alert('Register Success')
          window.location.href = '/login'
        }
    }


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
              Create an account
            </h1>
            <form className="tw-space-y-4 md:tw-space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
                >
                  Username
                </label>
                <Input type="text" id="username" placeholder="jhon.doe" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} />
              </div>
              <div>
                <label
                  htmlFor="fullname"
                  className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
                >
                  Fullname
                </label>
                <Input type="text" id="fullname" placeholder="jhon.doe"  value={form.fullname} onChange={(e) => setForm({...form, fullname: e.target.value})} />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
                >
                  Password
                </label>
                <Input type="password" id="password" placeholder="********"  value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
              </div>
              <div>
                <label
                  htmlFor="confirm_password"
                  className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
                >
                  Confirm Password
                </label>
                <Input type="password" id="confirm_password" placeholder="********" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} />
              </div>

              <Button type="submit">Sign up</Button>
              <p className="tw-text-sm tw-font-light tw-text-gray-500 dark:tw-text-gray-400">
                Already have an account?
                <a
                  href="/login"
                  className="tw-font-medium tw-text-primary-600 hover:tw-underline dark:tw-text-primary-500"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
