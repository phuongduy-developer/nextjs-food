"use client";

import { useAppContext } from "@/components/app-provider";
import { navigation } from "@/constants/navigation";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", //authRequired === undefinded tức là đăng nhập hay chưa đăng nhập đểu cho hiển thị
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: navigation.LOGIN,
    authRequired: false, //Khi false nghĩa là chưa đăng nhập thì sẽ hiển thị
  },
  {
    title: "Quản lý",
    href: navigation.MANAGE.DASHBOARD,
    authRequired: true, // đăng nhập rồi mới hiển thị
  },
];

// Server: Món ăn, đăng nhập. Do server không biết trạng thái của user
// Client: Đầu tiên client sẽ hiển thị là Món ăn, đăng nhập
// Nhưng ngay sau đó thì client render ra là Món ăn, đơn hàng, Quản lý do đã check được trạng thái của user

export default function NavItems({ className }: { className?: string }) {
  // IMPORTANT: Don't read localStorage during render.
  // Server render can't see it, but client can → hydration mismatch.
  // So we keep the first render consistent, then update after mount.

  // mặc định nextjs là server side rendering nên không thể truy cập vào localStorage nên phải dùng useEffect để render lại component sau khi client đã mount
  const { isAuth } = useAppContext();

  return menuItems.map((item) => {
    if (
      (isAuth && item.authRequired === false) ||
      (!isAuth && item.authRequired)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
