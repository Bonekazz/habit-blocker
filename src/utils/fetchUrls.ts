interface IBlockedUrl {
  href: string;
  isBlocked: boolean;
  favIconUrl: string;
}
export default async function fetchUrls() {
  const data = await browser.storage.local.get("blockedUrls");
  const urls = await data.blockedUrls as IBlockedUrl[];
  return Array.from(urls);
}