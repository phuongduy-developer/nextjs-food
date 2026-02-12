import { accountApiRequest } from "@/apiRequests/account";
import { accessTokenKey } from "@/constants/auth";
import { cookies } from "next/headers";

const DashboardPage = async () => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get(accessTokenKey)?.value as string;
  let name = "";
  const res = await accountApiRequest
    .sGetMe(accessToken)
  name = res.payload.data.name

  return <div>Dashboard {name}</div>;
};

export default DashboardPage;
