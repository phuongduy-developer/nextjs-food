'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import Field from '@/components/field'
import ImageUploadField from '@/components/image-upload-field'
import { useUploadImage } from '@/queries/media/useUploadImage'
import { handleErrorApi } from '@/lib/utils'
import { useUpdateMe } from '@/queries/account/useUpdateMe'
import { toast } from 'sonner'
import { useGetMe } from '@/queries/account/useGetMe'
import { useEffect } from 'react'

export default function UpdateProfileForm() {
  const { mutateAsync: uploadImageMutate } = useUploadImage()
  const { mutateAsync: updateProfile } = useUpdateMe()
  const { data: profile } = useGetMe()
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: ''
    }
  })
  const { setError, handleSubmit, setValue } = form
  useEffect(() => {
    if (profile?.payload.data.avatar) {
      setValue('avatar', profile?.payload.data.avatar)
    }
    if (profile?.payload.data.name) {
      setValue('name', profile?.payload.data.name)
    }
  }, [profile?.payload.data.avatar, profile?.payload.data.name, setValue])

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const data = await uploadImageMutate(formData)
    return data.payload.data
  }

  const onSubmit: SubmitHandler<UpdateMeBodyType> = async (data) => {
    try {
      let avatarUrl: string | undefined;

      // Chỉ upload nếu avatar là File mới
      if (data.avatar instanceof File) {
        avatarUrl = await uploadImage(data.avatar);
      } else if (typeof data.avatar === 'string' && data.avatar) {
        // Nếu avatar là string (URL hiện tại), giữ nguyên
        avatarUrl = data.avatar;
      }

      // Luôn gọi updateProfile với name (bắt buộc), avatar chỉ thêm nếu có
      const updateData: UpdateMeBodyType = {
        name: data.name,
        ...(avatarUrl && { avatar: avatarUrl })
      };

      const res = await updateProfile(updateData);
      toast.success(res.payload.message || 'Cập nhật thông tin thành công');
    } catch (error) {
      handleErrorApi({
        error,
        setError,
      });
    }
  };


  return (
    <Form {...form} >
      <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' onSubmit={handleSubmit(onSubmit)}>
        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>

              <ImageUploadField form={form} name='avatar' label='Ảnh đại diện' />
              <Field form={form} label='Tên' name='name' placeholder='Nguyen Van A' />

              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
