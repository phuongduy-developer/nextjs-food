"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "@/components/field";
import { useLoginMutation } from "@/queries/useAuth";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";

export default function LoginForm() {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, setError } = form;
  const { mutateAsync: loginFn, isPending } = useLoginMutation();

  const onSubmit: SubmitHandler<LoginBodyType> = async (data) => {
    loginFn(data, {
      onSuccess(data) {
        toast.success(data.payload.message);
      },
      onError(error) {
        handleErrorApi({
          error,
          setError,
        });
      },
    });
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 max-w-[600px] shrink-0 w-full"
            noValidate
          >
            <div className="grid gap-4">
              <Field
                form={form}
                label="Email"
                name="email"
                placeholder="abc@example.com"
              />
              <Field form={form} label="Password" name="password" />
              <Button type="submit" className="w-full" disabled={isPending}>
                Đăng nhập
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
