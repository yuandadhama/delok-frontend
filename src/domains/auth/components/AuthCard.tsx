import Image from "next/image";
import { ReactNode } from "react";
import Logo from "@/public/delok-light-logo.webp";

type Props = {
  title: string;
  children: ReactNode;
};

export default function AuthCard({ title, children }: Props) {
  return (
    <div
      className="
      w-full
      max-w-md
      rounded-lg
      border
      border-border
      bg-surface
      p-8
      shadow-lg
    "
    >
      <div className="flex items-center gap-2 mb-6 justify-center">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <Image src={Logo} alt="Delok Logo" width={40} height={40} />
      </div>

      {children}
    </div>
  );
}
