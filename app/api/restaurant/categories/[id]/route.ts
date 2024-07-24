// app/api/restaurant/categories/[id]/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = params;
    const body = await request.json();
    const { title, image, active, items } = body;
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        title,
        image,
        active,
        items: {
          deleteMany: {},
          create: items,
        },
      },
      include: { items: true },
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
