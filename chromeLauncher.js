const chromeLauncher = require('chrome-launcher')
const CDP = require('chrome-remote-interface')

launchChrome = (headless = true) => {
    return chromeLauncher.launch({
        port: 9222,
        chromeFlags:[
            '--window-size=412,732',
            '--disable-gpu',
            headless ? '--headless' : ''
        ]
    })
}

// launchChrome().then( async chrome => {
//     const version = await CDP.Version({port: chrome.port})
//     console.log(version)
//     // console.log(`chrome debugging op port ${chrome.port}`)
// })


// todo 获取页面是否有web应用清单
// (async () => {
//     const chrome = await launchChrome();
//     const protocal = await  CDP({port: chrome.port});
//
//     const { Page } = protocal;
//     await Page.enable();
//
//     Page.navigate({url: 'http://www.chromestatus.com'})
//     Page.loadEventFired(async () => {
//         const mainfest = await Page.getAppManifest();
//         if (mainfest.url) {
//             console.log('Mainfest:' + mainfest.url)
//             console.log(mainfest.data)
//         } else {
//             console.log('site has no app mainfest')
//         }
//
//         protocal.close();
//         chrome.kill();
//     })
// })()


//todo 提取页面的<title>标签的值
(async () => {
    const chrome = await launchChrome();
    const protocal = await  CDP({port: chrome.port});

    const { Page, Runtime } = protocal;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Page.navigate({url: 'http://www.chromestatus.com'})

    Page.loadEventFired(async () => {
        const js = "document.querySelector('title').textContent"
        const result = await Runtime.evaluate({expression: js})
        console.log("title of page " + result.result.value)
        // console.log(result)
        protocal.close();
        chrome.kill();
    })
})()



