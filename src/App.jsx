import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { initializeLocalForage } from "./utils/localforageUtils";
import { AuthProvider } from "./utils/AuthContextProvider";
import TestPage from "./pages/TestPage";

export default function App() {
  initializeLocalForage()
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="px-2 bg-gray-200 h-full">
          <Routes>
            <Route path="/" element={<TestPage />}></Route>
          </Routes>
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}
