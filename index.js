import puppeteer from "puppeteer";
import fs from "fs"
import buffer from "buffer"


var counter = 0;

(async() => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto("https://www.youtube.com/results?search_query=nutricon+colon+cancer")
    const video = await page.$$('#dismissible');
    if (counter !== 40) {
        await video[counter].click({ button: "right" })
            // var aElement = await page.$('#thumbnail')
            // var url = await (await aElement.getProperty('href')).jsonValue()
        var url = await page.$$eval('a', element => element.getAttribute("href"))

        console.log(url);
        const data = new Uint8Array(Buffer.from("url"))
        fs.writeFile('url.txt', data, (err) => { if (err) throw err; })
            // Write("a")
        counter++;
    }
    await page.screenshot("image.png");
    await browser.close()
})();

function Write(params) {
    const data = new Uint8Array(Buffer.from(params))
    fs.writeFile('url.txt', data, (err) => { if (err) throw err; })
}