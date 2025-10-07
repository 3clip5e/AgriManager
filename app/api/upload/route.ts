// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";  // Import config

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ 
  secure_url: "https://via.placeholder.com/300x300?text=Votre+Produit"  // Image placeholder
});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Vérifiez config avant upload
    if (!cloudinary.config().cloud_name) {
      return NextResponse.json({ error: "Cloudinary non configuré (vérifiez .env.local)" }, { status: 500 });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "products", 
          resource_type: "image",
          transformation: [{ width: 800, height: 600, crop: "limit" }]  // Redimensionne pour perf
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary Upload Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const result = uploadResult as any;
    return NextResponse.json({ 
      secure_url: result.secure_url,
      public_id: result.public_id 
    });

  } catch (error: any) {
    console.error("❌ Upload Route Error:", error.message || error);
    if (error.message.includes("api_key")) {
      return NextResponse.json({ 
        error: "Clé API Cloudinary manquante. Vérifiez .env.local et redémarrez le serveur." 
      }, { status: 500 });
    }
    return NextResponse.json({ error: "Erreur upload image" }, { status: 500 });
  }
}
