import { getQuote } from "@/lib/shipping";
export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    return Response.json(getQuote({
      zone: params.get("zone"),
      weight: Number(params.get("weight")),
      priority: params.get("priority") === "true" ? true : params.get("priority") === "false" ? false : null,
    }));
  }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Datos inválidos." }, { status: 400 }); }
}
