interface IBlockedUrl {
  href: string;
  isBlocked: boolean;
  favIconUrl: string;
}

const blockedUrls: any[] = []

browser.storage.local.set({blockedUrls})
.then(() => console.log("default data saved!"));

browser.tabs.query({})
.then(tabs => {
    tabs.forEach(tab => {
        const tabUrl = new URL(tab.url as string).hostname
        const foundUrl = blockedUrls.find(url => url.href === tabUrl);
        if(foundUrl) browser.tabs.remove(tab.id as number);
    })
})


browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action !== "blockCurrentHost") {
        sendResponse({error: true, message: "invalid action"});
        return true;
    }

    sendResponse(blockCurrentHost());
        
    return true;
})


browser.tabs.onUpdated.addListener((tabId, info, tab) => {
    const tabUrl = new URL(tab.url as string);
    browser.storage.local.get("blockedUrls")
    .then(data => {
        const urls = data.blockedUrls as IBlockedUrl[];
        const urlOnData = urls.find(url => url.href === tabUrl.hostname);
        if(urlOnData && urlOnData.isBlocked) {
            browser.tabs.remove(tabId).then(() => console.log("tab removed with success"));
        }

    });

});


async function blockCurrentHost(){
    

    try {
        const query = await browser.tabs.query({active: true, currentWindow: true});
        const url = new URL(query[0].url as string).hostname;

        const data = await browser.storage.local.get("blockedUrls");
        const dataUrls = data.blockedUrls as IBlockedUrl[];
        const foundHref = dataUrls.find(u => u.href === url);

        if(foundHref) return {error: false, message: "url already saved"};

        const favIconUrl = query[0].favIconUrl;

        const newBlocked = {
            href: url,
            isBlocked: true,
            favIconUrl: favIconUrl as string,
        };
        
        blockedUrls.unshift(newBlocked);
            

        await browser.storage.local.set({blockedUrls});
        const tabs = await browser.tabs.query({})
        tabs.forEach(tab => {
            const tabUrl = new URL(tab.url as string).hostname;
            if(tabUrl === url){ 
                browser.tabs.remove(tab.id as number)
                .then(() => console.log(`all ${tabUrl} tabs were closed`));
            }
        })
        console.log(tabs);
        console.log(`${url} blocked with success`); 

        return {error: false, savedUrl: newBlocked};
        
    } catch (error) {
        return {error: true, message: error};
    }
}

async function getBlockedUrls() {
    const urls = await browser.storage.local.get("blockedUrls");
    return Array.from(urls.blockedUrls);
}


// check if url is already blocked!

// storage.local.
// storage.local.sync