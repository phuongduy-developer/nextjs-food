import { accountApiRequest } from "@/apiRequests/account";
import { accessTokenKey } from "@/constants/auth";
import { cookies } from "next/headers";

const DashboardPage = async () => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get(accessTokenKey)?.value as string;
  let name = "";
  accountApiRequest
    .sGetMe(accessToken)
    .then((res) => (name = res.payload.data.name))

  return <div>Dashboard {name}</div>;
};

export default DashboardPage;
