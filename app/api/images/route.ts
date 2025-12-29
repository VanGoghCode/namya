import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // e.g., 'Hero' or 'Bridal'

    let expression = "folder:namya-portfolio";
    if (category && category !== "All") {
      expression += ` AND tags:${category}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(30)
      .with_field("tags")
      .execute();

    const images = resources.map((file: any) => ({
      id: file.public_id,
      url: file.secure_url,
      width: file.width,
      height: file.height,
      tags: file.tags,
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    // category can be a single string or JSON string of tags array
    const category = (formData.get("category") as string) || "General";

    // Parse tags if it's a JSON string, otherwise use as single tag
    let tags = [category];
    try {
      const parsed = JSON.parse(category);
      if (Array.isArray(parsed)) tags = parsed;
    } catch (e) {
      // Not JSON, use as single tag
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using a promise wrapper
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "namya-portfolio",
            tags: tags,
            resource_type: "auto",
            transformation: [
              { width: 1920, height: 1920, crop: "limit" }, // Resize if larger than 1920px
              { quality: "auto:good" }, // Smart compression
              { fetch_format: "auto" }, // Use modern formats like WebP/AVIF
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Error deleting image" },
      { status: 500 }
    );
  }
}
