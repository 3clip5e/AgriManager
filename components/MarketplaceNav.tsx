     "use client";

     import { useUser } from "@/hooks/useUser";  // Import corrigé (pas d'espace)
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
     import { Sprout, Home, ShoppingCart, User, Settings, LogOut } from "lucide-react";
     import Link from "next/link";
     import { usePathname } from "next/navigation";  // Import déjà présent
     import { signOut } from "@/lib/actions";

     export default function MarketplaceNav() {
       const { user, loading } = useUser ();
       const pathname = usePathname();  // ← AJOUTEZ CETTE LIGNE (ligne ~13) : Définit pathname

       // if (loading) return <p>Chargement...</p>;  // Optionnel
       if (!user) return <p className="text-center py-4 text-gray-500">Non connecté</p>;

       const initials = user.full_name
         ? user.full_name
             .split(" ")
             .map((n) => n[0])
             .join("")
             .toUpperCase()
         : user.email[0].toUpperCase();

       // Navigation buyer simplifiée
       const navigation = [
         { name: "Accueil", href: "/", icon: Home },
         { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
         { name: "Panier", href: "/cart", icon: ShoppingCart },  // Commentez si /cart absent
         { name: "Profil", href: "/profile", icon: User },
       ];

       return (
         <nav className="bg-white shadow-sm border-b">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between items-center py-4">
               {/* Logo */}
               <Link href="/marketplace" className="flex items-center">
                 <Sprout className="h-8 w-8 text-green-600 mr-3" />
                 <h1 className="text-2xl font-bold text-green-800">AgriMarket</h1>
               </Link>

               {/* Navigation buyer (desktop) */}
               <div className="hidden md:flex space-x-8">
                 {navigation.map((item) => {
                   const Icon = item.icon;
                   const isActive = pathname === item.href;  // ← Maintenant défini (ligne 55 OK)
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
                       <p className="text-sm font-medium leading-none">{user.full_name || "Client"}</p>
                       <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                     </div>
                   </DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem asChild>
                     <Link href="/profile" className="flex items-center">
                       <User className="mr-2 h-4 w-4" />
                       Profil
                     </Link>
                   </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                     <Link href="/settings" className="flex items-center">
                       <Settings className="mr-2 h-4 w-4" />
                       Paramètres
                     </Link>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem asChild>
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
     