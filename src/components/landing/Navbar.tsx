"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { ROUTES } from "@/src/constants/routes";
import { ASSETS } from "@/src/constants/assets";
import Image from "next/image";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

const NAV_LINKS: readonly NavLink[] = [
  { label: "Docs", href: "/docs" },
  {
    label: "GitHub",
    href: "https://github.com/yuandadhama/delok",
    external: true,
  },
];

const AUTH_LINKS = [
  { label: "Sign in", href: ROUTES.AUTH.SIGN_IN, variant: "ghost" as const },
  {
    label: "Get started",
    href: ROUTES.AUTH.SIGN_UP,
    variant: "primary" as const,
  },
] as const;

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navContent = (
    <>
      <Link
        href={ROUTES.HOME}
        className="flex items-center gap-2"
        aria-label="Delok Home"
      >
        <Image
          src={ASSETS.LOGO.LIGHT_TEXT}
          alt="Delok"
          width={100}
          height={100}
        />
      </Link>

      <nav className="flex items-center gap-6" aria-label="Main navigation">
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-2 py-1 inline-flex items-center gap-1"
            >
              {link.label}
              {link.external && (
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {AUTH_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                link.variant === "primary"
                  ? "bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 text-sm"
                  : "text-foreground hover:bg-surface-hover px-4 py-2 text-sm"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden p-2 rounded-md text-foreground hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>
    </>
  );

  const mobileMenu =
    mounted && isMobileMenuOpen
      ? createPortal(
          <div
            id="mobile-menu"
            className="fixed inset-0 z-50 flex flex-col bg-background"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link
                href={ROUTES.HOME}
                className="flex items-center gap-2"
                aria-label="Delok Home"
                onClick={closeMobileMenu}
              >
                <Image
                  src={ASSETS.LOGO.LIGHT_TEXT}
                  alt="Delok"
                  width={100}
                  height={100}
                />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md text-foreground hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
                aria-label="Close menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav
              className="flex-1 p-4 overflow-y-auto"
              aria-label="Mobile navigation"
            >
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="block px-3 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={closeMobileMenu}
                    >
                      <span className="flex items-center gap-1.5">
                        {link.label}
                        {link.external && (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="pt-4 border-t border-border">
                  <div className="flex flex-col gap-2">
                    {AUTH_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          link.variant === "primary"
                            ? "bg-primary text-primary-foreground hover:opacity-90 px-4 py-3 text-base"
                            : "text-foreground hover:bg-surface-hover px-4 py-3 text-base border border-border"
                        }`}
                        onClick={closeMobileMenu}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </li>
              </ul>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {navContent}
        </div>
      </div>
      {mobileMenu}
    </header>
  );
}
