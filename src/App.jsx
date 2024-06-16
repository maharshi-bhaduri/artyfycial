import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { initializeLocalForage } from "./utils/localforageUtils";
import { AuthProvider } from "./utils/AuthContextProvider";
import TestPage from "./pages/TestPage";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Navbar from "./components/Navbar";

export default function App() {
  initializeLocalForage();
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow overflow-auto mt-16 flex items-center">
            <Routes>
              <Route path="/test" element={<TestPage />}></Route>
              <Route path="/" element={<Home />}></Route>
              <Route path="/discover" element={<Discover />}></Route>
            </Routes>
          </div>
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}
