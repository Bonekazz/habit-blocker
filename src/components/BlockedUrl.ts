import fetchUrls from "../utils/fetchUrls";
import { createElement, Trash2 } from "lucide";
import { EmptyData } from "./EmptyData";

export function BlockedUrl(data: any) {
  const li = document.createElement("li");
  li.className = "flex justify-between items-center gap-[5em]";
  li.id = data.href;

  const hrefWrapper = document.createElement("div");
  hrefWrapper.className = "flex gap-2 w-fit";

  const img = document.createElement("img");
  img.setAttribute("width", "32");
  img.setAttribute("height", "32");
  img.style.width = "16px";
  img.style.height = "16px";
  img.src = data.favIconUrl;

  const hrefSpan = document.createElement("span");
  hrefSpan.className = "text-sm";
  hrefSpan.innerText = data.href;

  hrefWrapper.append(img, hrefSpan);

  // -------

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "flex gap-2";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.classList.add("cursor-pointer");
  input.checked = data.isBlocked ? true : false;
  input.onchange = (e) => {
    const element = (e.currentTarget as HTMLElement);
    const parent = element.parentElement?.parentElement as HTMLElement;
    changeIsBlocked(parent.id, input.checked);
  };

  const button = createElement(Trash2);
  button.classList.add("delete-url-btn", "rounded-md", "w-5", "cursor-pointer");
  button.setAttribute("color", "#ed333b");
  button.setAttribute("size", "20px");
  button.onclick = (e) => {
    const element = (e.currentTarget as HTMLElement);
    const parent = element.parentElement?.parentElement as HTMLElement;
    removeUrl(parent);
  }

  buttonsWrapper.append(input, button);

  li.append(hrefWrapper, buttonsWrapper);

  return li;
}

async function changeIsBlocked(id: string, isChecked: boolean) {
  const urls = await fetchUrls();
  const blockedUrls = urls.map(url => {
    if(url.href === id){
      url.isBlocked = isChecked;
    }

    return url;
  })

  browser.storage.local.set({blockedUrls})
  .then(() => console.log("change saved!"))
  .catch(error => console.log(error));
  
}

async function removeUrl(element: HTMLElement) {
  const urls = await fetchUrls();
  const blockedUrls = urls.filter(url => url.href !== element.id);
  await browser.storage.local.set({blockedUrls});
  const wrapperElement = element.parentElement as HTMLElement;
  wrapperElement.removeChild(element);
  if(blockedUrls.length === 0) {
    wrapperElement.append(EmptyData());
  }
}