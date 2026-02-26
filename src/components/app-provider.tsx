"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import {
  getAccessTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "@/lib/utils";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const AppContext = createContext<{
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
}>({
  isAuth: false,
  setIsAuth: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuthState] = useState<boolean>(false);

  // Next js 15 và React 19 không cần useCallback
  const setIsAuth = (isAuth: boolean) => {
    setIsAuthState(isAuth);
    if (!isAuth) {
      removeTokenFromLocalStorage();
    }
  };

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      setIsAuth(true);
    }
  }, []);

  // Nếu dùng React 19 và next js 15 thì không cần AppContext.Provider chỉ cần AppContext là đủ
  return (
    <AppContext
      value={{
        isAuth,
        setIsAuth,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </AppContext>
  );
};
export default AppProvider;
