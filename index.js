import puppeteer from "puppeteer";
import fs from "fs"
import buffer from "buffer"


var counter = 0;
var urls = [""];
(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto("https://www.youtube.com/results?search_query=nutricon+colon+cancer")
    const videos = await page.$$('#thumbnail');
    
    autoScroll(page)
    
    await page.evaluate(_ => {
        window.scrollBy(0, window.innerHeight);
    });
    console.log(videos.length);
    while(counter <= 40)
    {
        counter ++;
    }
    // console.log(videos.length);
    // await page.waitForTimeout(50000);

    for (let video of videos) {
        try {
            console.log(await (await video.getProperty('href')).jsonValue());
            urls += "\n" + await (await video.getProperty('href')).jsonValue();
        } catch (error) {
            console.log(error)
        }
    }

    await page.waitForTimeout(100)

    const data = new Uint8Array(Buffer.from(urls))
    fs.writeFile('url.txt', data, (err) => { if (err) throw err; })
    await page.screenshot("image.png");
    await browser.close()
})();

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}