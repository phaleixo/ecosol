
import { cookies } from "next/headers";

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  // A segurança reside em comparar o token do cookie com o segredo do servidor
  return token === process.env.ADMIN_SECRET;
}