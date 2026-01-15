import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

interface FieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}

const FieldTextArea = <T extends FieldValues>({
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
          <FormLabel className="text-slate-600">{label}</FormLabel>
          <Textarea placeholder={placeholder} {...field} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FieldTextArea;
