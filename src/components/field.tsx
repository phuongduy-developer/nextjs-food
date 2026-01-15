import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface FieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}

const Field = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "",
}: FieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name} className="text-white!">
            {label}
          </FormLabel>
          <Input placeholder={placeholder} {...field} id={name} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Field;
