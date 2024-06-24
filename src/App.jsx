import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { initializeLocalForage } from "./utils/localforageUtils";
import { AuthProvider } from "./utils/AuthContextProvider";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Create from "./pages/Create";
import Navbar from "./components/Navbar";

export default function App() {
  initializeLocalForage();
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="h-screen flex flex-col ">
          <Navbar />
          <div className="flex-grow overflow-auto mt-16 flex items-center">
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/discover" element={<Discover />}></Route>
              <Route path="/create" element={<Create />}></Route>
            </Routes>
          </div>
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}
