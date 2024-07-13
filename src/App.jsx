import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { initializeLocalForage } from "./utils/localforageUtils";
import { AuthProvider } from "./utils/AuthContextProvider";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Create from "./pages/Create";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ArtworkMain from "./pages/ArtworkMain";
import PageNotFound from "./pages/PageNotFound";
import Account from "./pages/Account";
import Artist from "./pages/Artist";
import AccountUpdate from "./pages/AccountUpdate";


export default function App() {
  initializeLocalForage();
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="h-screen flex ">
          <Navbar />
          <div className="flex-grow overflow-auto mt-12 md:px-20">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute onlyPublic={true}>
                  <Home />
                </ProtectedRoute>
              }></Route>
              <Route path="/discover" element={
                <ProtectedRoute> <Discover /></ProtectedRoute>
              }></Route>
              <Route path="/create" element={
                <ProtectedRoute> <Create /></ProtectedRoute>}
              ></Route>
              <Route path="/artwork/:artworkId/*" element={
                <ProtectedRoute><ArtworkMain /></ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute><Account /></ProtectedRoute>
              } />
              <Route path="/account/edit" element={
                <ProtectedRoute><AccountUpdate /></ProtectedRoute>
              } />
              <Route path="/artist/:userName/*" element={
                <ProtectedRoute><Artist /></ProtectedRoute>
              } />
              <Route path="/error" element={
                <ProtectedRoute><PageNotFound /></ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}
