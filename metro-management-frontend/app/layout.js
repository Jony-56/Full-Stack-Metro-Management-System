import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Metro Management System",
  description: "Modern metro ticketing and management frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}