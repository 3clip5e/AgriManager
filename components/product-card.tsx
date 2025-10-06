     // components/product-card.tsx (version améliorée : Image + DB align + truncate desc)
     import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
     import { Badge } from "@/components/ui/badge";
     import { Button } from "@/components/ui/button";
     import { MapPin, Calendar, Leaf, ShoppingCart, Image as ImageIcon } from "lucide-react";  // Ajout ImageIcon
     import Link from "next/link";
     import Image from "next/image";  // Next.js Image optimisé

     interface Product {
       id: string;
       name: string;
       description?: string;
       category: string;
       price_per_unit: number;  // Align DB (ou price si pas changé)
       unit?: string;  // Optionnel, fallback 'kg'
       quantity_available: number;
       harvest_date?: string;
       expiry_date?: string;
       organic_certified: boolean;
       status: string;
       image_url?: string;  // Ajout pour image
       profiles?: {  // De JOIN users + user_profiles
         full_name?: string;
         farm_name?: string;
         city?: string;
       };
     }

     interface ProductCardProps {
       product: Product;
       showActions?: boolean;
     }

     export default function ProductCard({ product, showActions = true }: ProductCardProps) {
       const isAvailable = product.status === "available" && product.quantity_available > 0;
       const unit = product.unit || "kg";  // Fallback
       const truncatedDesc = product.description ? `${product.description.substring(0, 100)}${product.description.length > 100 ? "..." : ""}` : undefined;

       return (
         <Card className="hover:shadow-lg transition-shadow group">
           {/* Image Section (ajoutée) */}
           <div className="relative h-48 overflow-hidden bg-gray-100">
             {product.image_url ? (
               <Image
                 src={product.image_url}
                 alt={product.name}
                 fill
                 className="object-cover group-hover:scale-105 transition-transform"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
               />
             ) : (
               <div className="flex items-center justify-center h-full text-gray-400">
                 <ImageIcon className="h-12 w-12" />
               </div>
             )}
           </div>

           <CardHeader className="p-4 pb-2">
             <div className="flex items-start justify-between">
               <div className="flex-1">
                 <CardTitle className="text-lg text-green-800 line-clamp-1">{product.name}</CardTitle>  {/* Truncate nom */}
                 <div className="flex items-center gap-2 mt-1 flex-wrap">
                   <Badge variant="outline" className="text-xs">
                     {product.category}
                   </Badge>
                   {product.organic_certified && (
                     <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                       <Leaf className="h-3 w-3 mr-1" />
                       Bio
                     </Badge>
                   )}
                 </div>
               </div>
               <div className="text-right ml-2">
                 <p className="text-xl font-bold text-green-600">€{product.price_per_unit.toFixed(2)}</p>
                 <p className="text-xs text-gray-600">/ {unit}</p>
               </div>
             </div>
           </CardHeader>

           <CardContent className="p-4 pt-2 space-y-3">
             {/* Description (truncate) */}
             {truncatedDesc && <p className="text-sm text-gray-700 line-clamp-2">{truncatedDesc}</p>}

             {/* Seller Info (profiles de DB) */}
             {product.profiles && (
               <div className="flex items-center text-sm text-gray-600">
                 <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                 <span className="truncate">
                   {product.profiles.farm_name || product.profiles.full_name || "Ferme anonyme"}
                   {product.profiles.city && ` • ${product.profiles.city}`}
                 </span>
               </div>
             )}

             {/* Availability */}
             <div className="flex items-center justify-between text-sm">
               <div className="flex items-center">
                 <span className="text-gray-600">Stock:</span>
                 <span className="ml-1 font-medium text-green-600">
                   {product.quantity_available} {unit}
                 </span>
               </div>
               <Badge className={isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800 text-xs"}>
                 {isAvailable ? "Disponible" : "Épuisé"}
               </Badge>
             </div>

             {/* Dates */}
             <div className="flex flex-wrap gap-3 text-xs text-gray-600">
               {product.harvest_date && (
                 <div className="flex items-center">
                   <Calendar className="h-3 w-3 mr-1" />
                   <span>Récolte: {new Date(product.harvest_date).toLocaleDateString('fr-FR')}</span>
                 </div>
               )}
               {product.expiry_date && (
                 <div className="flex items-center">
                   <Calendar className="h-3 w-3 mr-1" />
                   <span>Expire: {new Date(product.expiry_date).toLocaleDateString('fr-FR')}</span>
                 </div>
               )}
             </div>

             {/* Actions */}
             {showActions && (
               <div className="flex gap-2 pt-3">
                 <Link href={`/marketplace/${product.id}`} className="flex-1">
                   <Button variant="outline" className="w-full text-sm">
                     Détails
                   </Button>
                 </Link>
                 {isAvailable && (
                   <Link href={`/marketplace/${product.id}/order`} className="flex-1">
                     <Button className="w-full bg-green-600 hover:bg-green-700 text-sm">
                       <ShoppingCart className="h-4 w-4 mr-2" />
                       Commander
                     </Button>
                   </Link>
                 )}
               </div>
             )}
           </CardContent>
         </Card>
       );
     }
     