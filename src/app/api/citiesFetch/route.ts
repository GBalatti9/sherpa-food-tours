// app/api/cities/route.ts
import { wp } from "@/lib/wp";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cities = await wp.getAllCities();
    return NextResponse.json(cities, { status: 200 });
  } catch (error) {
    console.error("Error en /api/cities:", error);
    return NextResponse.json(
      { message: "Error al obtener ciudades" },
      { status: 500 }
    );
  }
}
