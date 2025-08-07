import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/react-query";
import AuthProvider from "@/features/auth/providers/AuthProvider";
import { initializeCreditScheduler } from "@/features/credits/allocation/services/initScheduler";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/features/auth/lib/auth";
import { ReferralTracker } from "@/features/referrals/components/ReferralTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "THISTHAT",
  description: "Your social Tinder",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize credit scheduler on server startup
  if (typeof window === 'undefined') {
    initializeCreditScheduler();
  }

  // Fetch the server session to pass down via SessionProvider
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lato.variable} antialiased`}
      >
        <AuthProvider session={session}>
          <ReactQueryProvider>
            <ReferralTracker />
            {children}
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
