import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// ✅ API handler for serving images
export async function GET(req, { params }) {
  const { image } = await params; // ["centers", "image_1740479187014_1.jpeg"]
  const imagePath = path.join(process.cwd(), "_upl", ...image); // Construct path

  if (fs.existsSync(imagePath)) {
    const fileBuffer = fs.readFileSync(imagePath); // Read file

    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream"; // Default fallback

    return new NextResponse(fileBuffer, {
      headers: { "Content-Type": contentType },
    });
  } else {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}

