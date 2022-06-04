import puppeteer from "puppeteer";
import fs from "fs"
import buffer from "buffer"


var counter = 0;
var urls = [""];
(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto("https://www.youtube.com/results?search_query=nutricon+colon+cancer")
    var videos = await page.$$('#thumbnail');
console.log(videos.length);
    var videoList = [];

    while (videoList.length <= 400) {

        await page.evaluate(_ => {
            window.scrollBy(0, window.innerHeight);
        });
        await page.waitForTimeout(900);

        videos = await page.$$('#thumbnail')
        for (var video of videos) {
            var cntr = await (await video.getProperty('href')).jsonValue();
            if (cntr !== undefined && cntr !== '' && cntr !== ' ') {
                videoList.push(video);
                console.log(videoList.length);
            }
        }
    }

    for (let video of videoList) {
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
