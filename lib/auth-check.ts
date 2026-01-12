import { cookies } from "next/headers";

/**
 * Função utilitária para verificar se o usuário é um administrador
 * comparando o cookie enviado com a variável de ambiente ADMIN_SECRET.
 */
export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  
  // Verifica se o token existe e é igual à senha definida no .env
  return token?.value === process.env.ADMIN_SECRET;
}