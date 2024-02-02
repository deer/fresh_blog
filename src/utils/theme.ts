export function themeFromRequest(req: Request): "light" | "dark" | "auto" {
  const cookieHeader = req.headers.get("cookie");
  const themeMatch = cookieHeader?.match(/theme=(dark|light)/);
  return themeMatch ? themeMatch[1] as "light" | "dark" : "auto";
}
