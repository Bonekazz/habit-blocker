import { BlockedUrl } from "./components/BlockedUrl";
import { EmptyData } from "./components/EmptyData";
import fetchUrls from "./utils/fetchUrls";

const blockCurrentBtn = document.getElementById("block-current-btn") as HTMLElement;

export const blockedUrlsListElement = document.getElementById("blocked-urls-list") as HTMLElement;

renderBlockedUrls();

blockCurrentBtn.addEventListener("click", () => {
  browser.runtime.sendMessage({action: "blockCurrentHost"} , undefined)
  .then(response => {
    if(response.error || response.message){
      console.log(response.message);
      return;
    }
    
    const emptyData = document.getElementById("empty-data") as HTMLElement;
    blockedUrlsListElement.removeChild(emptyData);
    blockedUrlsListElement.insertBefore(BlockedUrl(response.savedUrl), blockedUrlsListElement.firstChild);
    
  })
});

export async function renderBlockedUrls() {
  const urls = await fetchUrls();

  if(urls.length === 0) {
    blockedUrlsListElement.append(EmptyData());
    return;
  }

  urls.forEach(url => {
    blockedUrlsListElement.appendChild(BlockedUrl(url));
  })
  
  
}