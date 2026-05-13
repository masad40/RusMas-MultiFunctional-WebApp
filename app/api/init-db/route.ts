import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb/client";

export async function POST() {
  try {
    const db = await getDb();
    
    // Create collections with sample data
    const collections = [
      {
        name: "users",
        sampleData: {
          uid: "sample-admin-uid",
          name: "Admin User",
          email: "admin@rusmas.com",
          phone: "",
          imageUrl: "",
          role: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        name: "products",
        sampleData: {
          id: "sample-product-1",
          slug: "sample-product",
          title: "Sample Product",
          category: "accessories",
          priceCents: 1000,
          currency: "BDT",
          imageUrls: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
          description: "This is a sample product",
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        name: "photos",
        sampleData: {
          title: "Sample Photo",
          alt: "Sample photo description",
          src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
          category: "wedding",
          width: 1600,
          height: 1067,
          createdAt: new Date().toISOString(),
        },
      },
      {
        name: "videos",
        sampleData: {
          title: "Sample Video",
          description: "Sample video description",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          featured: true,
          createdAt: new Date().toISOString(),
        },
      },
      {
        name: "orders",
        sampleData: {
          orderNumber: "ORD-" + Date.now(),
          status: "pending",
          customer: {
            name: "Sample Customer",
            email: "customer@example.com",
            phone: "01234567890",
            address: "Dhaka, Bangladesh",
          },
          items: [
            {
              productId: "sample-product-1",
              title: "Sample Product",
              priceCents: 1000,
              quantity: 1,
            },
          ],
          subtotalCents: 1000,
          currency: "BDT",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        name: "contact_messages",
        sampleData: {
          name: "Sample Contact",
          email: "contact@example.com",
          message: "This is a sample contact message",
          createdAt: new Date().toISOString(),
        },
      },
    ];

    const results = [];

    for (const collection of collections) {
      // Check if collection exists
      const existingCollections = await db.listCollections({ name: collection.name }).toArray();
      
      if (existingCollections.length === 0) {
        // Create collection and insert sample data
        await db.createCollection(collection.name);
        await db.collection(collection.name).insertOne(collection.sampleData);
        results.push({ collection: collection.name, status: "created" });
      } else {
        results.push({ collection: collection.name, status: "already exists" });
      }
    }

    // Create indexes
    await db.collection("users").createIndex({ uid: 1 }, { unique: true });
    await db.collection("users").createIndex({ email: 1 });
    await db.collection("products").createIndex({ id: 1 }, { unique: true });
    await db.collection("products").createIndex({ slug: 1 }, { unique: true });
    await db.collection("orders").createIndex({ orderNumber: 1 }, { unique: true });

    return NextResponse.json({
      ok: true,
      message: "Database initialized successfully!",
      database: db.databaseName,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Database initialization failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
