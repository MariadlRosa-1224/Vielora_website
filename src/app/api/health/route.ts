import { NextResponse } from "next/server";

/**
 * El ALB llama periódicamente esta ruta.
 * Si recibe HTTP 200, considera saludable al contenedor.
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}