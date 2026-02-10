import { ReactNode } from "react";
import "@/assets/styles/global.css";
import { Inter, Roboto_Mono } from "next/font/google";
import { AuthProvider } from "@/context/ApiContext";
import { Toaster } from "sonner";
import {
  ConditionalNavbar,
  ConditionalFooter,
} from "@/app/components/conditionNavLayout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// const robotoMono = Roboto_Mono({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-roboto-mono",
// });

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={inter.className}>
        <AuthProvider>
          {/* <Navbar /> */}
          <main>{children}</main>
          <Toaster />
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
};

export default MainLayout;
