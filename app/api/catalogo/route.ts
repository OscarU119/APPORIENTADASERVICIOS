import { zones } from "@/lib/shipping";
export async function GET() {
  return Response.json({ zones: zones.map(({ id, name, days }) => ({ id, name, days })) });
}
