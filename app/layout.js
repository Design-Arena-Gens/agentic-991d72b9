export const metadata = {
  title: "Fitness Dashboard",
  description: "Minimalistic fitness tracking dashboard"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
