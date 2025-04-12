"use client";

import { FieldError, useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  interface LoginFormData {
    email: string;
    password: string;
  }

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    console.log("Login Data:", data);
  };

  return (
    <div className="max-w-md m-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" {...register("email", { required: "Email is required" })} placeholder="Enter your email" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{(errors.email as FieldError).message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <Input type="password" {...register("password", { required: "Password is required" })} placeholder="Enter your password" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{(errors.password as FieldError).message}</p>}
        </div>

        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
