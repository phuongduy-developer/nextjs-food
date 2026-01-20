'use client'
import { ChangeEvent, MouseEvent, useRef, useState } from 'react'
import { ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { CircleX, Upload } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

interface ImageUploadFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
}
const image_file = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/tiff",
    "image/svg+xml",
    "image/ico",
    "image/vnd.microsoft.icon",
];

const ImageUploadField = <T extends FieldValues>(
    {
        form,
        name,
        label,
    }: ImageUploadFieldProps<T>) => {
    const [nameFile, setNameFile] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)
    const handleUploadImage = (e: ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<T, Path<T>>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files?.[0]
            if (file && !image_file.includes(file.type)) {
                toast.warning("Vui lòng upload file ảnh")
                return
            }
            if (file) {
                const img = document.createElement("img") as HTMLImageElement;
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                    field.onChange(file);
                    setNameFile(file.name || "");
                };
            }
        }

    }
    const onDeleteImage = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        field: ControllerRenderProps<T, Path<T>>) => {
        if (e) e.preventDefault()

        setNameFile("");

        field.onChange(undefined);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className="w-[300px] overflow-hidden cursor-pointer">
                        <FormLabel className="text-white flex flex-col items-start" htmlFor={name}>
                            <p>{label}</p>
                            {!field.value ? (
                                <div className="border-dotted border h-[100px] w-[100px] flex items-center justify-center cursor-pointer rounded-md">
                                    <Upload />
                                    <input
                                        id={name}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleUploadImage(e, field)}
                                        ref={inputRef}
                                    />
                                </div>
                            ) : (
                                <div className="h-[100px] w-[100px] overflow-hidden group relative cursor-pointer rounded-md">
                                    <Button
                                        className="absolute top-0 right-0 z-10 h-[35px] w-[35px] cursor-pointer opacity-0 transition-all group-hover:opacity-100"
                                        onClick={(e) => onDeleteImage(e, field)}
                                    >
                                        <CircleX />
                                    </Button>
                                    <Image
                                        src={
                                            typeof field.value === "string"
                                                ? field.value
                                                : URL.createObjectURL(field.value)
                                        }
                                        alt="img"
                                        fill
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                                        <AvatarImage src={typeof field.value === "string"
                                            ? field.value
                                            : URL.createObjectURL(field.value)} />
                                        <AvatarFallback className='rounded-none'>{'duoc'}</AvatarFallback>
                                    </Avatar>
                                </div>
                            )}

                            {nameFile && (
                                <p className="text-gray-500 text-sm italic">{nameFile}</p>
                            )}
                        </FormLabel>

                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    )
}

export default ImageUploadField