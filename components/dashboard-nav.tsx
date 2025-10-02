"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sprout, Home, MapPin, ShoppingCart, Brain, Settings, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function TableauDeBordNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (status === "loading") return <p>Chargement...</p>;
  if (!session?.user) return <p>Non connecté</p>;

  const user = session.user;
  const userType = user.userType;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  // Navigation items for farmers only
  const farmerNavigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: Home },
    { name: "Champs", href: "/dashboard/fields", icon: MapPin },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingCart },
    { name: "Conseiller IA", href: "/dashboard/ai-advisor", icon: Brain },
    { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ];

  const navigation = userType === 'farmer' ? farmerNavigation : [];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <Sprout className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-2xl font-bold text-green-800">AgriManager</h1>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || "/placeholder.svg"} />
                  <AvatarFallback className="bg-green-100 text-green-700">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name || "Utilisateur"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <p className="text-xs leading-none text-green-600 font-medium">
                    {userType === 'farmer' ? 'Agriculteur' : 'Client'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userType === 'farmer' && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem>
                <button onClick={() => signOut({ callbackUrl: "/auth/login" })} className="flex items-center w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
