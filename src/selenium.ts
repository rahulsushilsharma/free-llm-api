import { Builder, Browser, By, until, WebDriver, WebElement, Capabilities, } from "selenium-webdriver";
import * as cheerio from 'cheerio';
import { writeFile } from 'fs'
import { saveUserSession } from "./database";
// const options = new chrome.Options()
// options.addArguments("--remote-allow-origins='*'")
// options.addArguments('--disable-extensions')
// options.


let driver: WebDriver | null = null

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function seleniumInit() {
    // const options = new Capabilities();
    // options.set('browserName', 'chrome');
    // options.set('chromeOptions', {
    //     'args': ['user-data-dir=C:\\Users\\rahu8\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 2'],
    // });
    driver = await new Builder().forBrowser(Browser.CHROME).build();

}


/**
 * Navigates to the specified URL.
 * @param url - The URL to navigate to.
 */
async function gotoPage(url: string) {
    await driver?.get(url);
}

async function loadSession(serializedCookies = '') {
    if (!driver) return;
    // Load the saved cookies from a file or storage
    // For example, deserialize the JSON from the file and convert it back to an array
    // Load serialized cookies from file or storage
    const cookies = JSON.parse(serializedCookies);

    // Add the saved cookies to the WebDriver instance
    for (const cookie of cookies) {
        await driver.manage().addCookie(cookie);
        console.log(cookie)
    }
}

async function getUserSessionfromBrowsern() {
    if (!driver) return;

    // Get the current session cookies
    const cookies = await driver.manage().getCookies();

    // Save the cookies to a file or a storage mechanism of your choice
    // For example, you can serialize the cookies array to JSON and save it to a file
    const serializedCookies = JSON.stringify(cookies);
    return serializedCookies;
}

async function loginToOpenAi(id: string, pass: string) {
    if (!driver) return
    

    const loginButtonPath1 = "//*[text()='Log in']"
    const loginButtonPath2 = "//*[text()='Log in']"
    const emailFeildPath = "//*[text()='Email address']"
    const continueButtonPath1 = '/html/body/div/main/section/div/div/div/div[1]/div/form/div[2]/button'
    const passwordFeildPath = '//*[@id="password"]'
    const continueButtonPath2 = '/html/body/div/main/section/div/div/div/form/div[3]/button'

    if (driver) {
        await sleep(3000)
        try {
            const btn = await driver.findElement(By.xpath(loginButtonPath1))
            await driver.wait(until.elementIsVisible(btn));
            await btn.click()
        } catch {
            const btn = await driver.findElement(By.xpath(loginButtonPath2))
            await driver.wait(until.elementIsVisible(btn));
            await btn.click()
        }

        await sleep(3000)
        const email = await driver.findElement({ css: '#username' })
        await driver.wait(until.elementIsVisible(email));
        await email.sendKeys(id);
        // await driver?.findElement()
        await sleep(3000)

        await driver?.findElement(By.xpath(continueButtonPath1)).click();
        await sleep(3000)

        await driver?.findElement(By.xpath(passwordFeildPath)).sendKeys(pass);
        await sleep(3000)

        await driver?.findElement(By.xpath(continueButtonPath2)).click();
    }
}

async function skipIntro() {
    const nextBtnPath = "//*[text()='Next']"
    const doneBtnPath = "//*[text()='Done']"

    await sleep(3000)

    await driver?.findElement(By.xpath(nextBtnPath)).click();
    await sleep(1000)

    await driver?.findElement(By.xpath(nextBtnPath)).click();
    await sleep(1000)

    await driver?.findElement(By.xpath(doneBtnPath)).click();

}
async function messege(messege: string) {
    const textAreaPath = '//*[@id="prompt-textarea"]'
    const submitButtonPath = '//*[@id="__next"]/div[1]/div[2]/div/main/div[2]/form/div/div[2]/button'

    await driver?.findElement(By.xpath(textAreaPath)).sendKeys(messege);
    await sleep(3000)

    await driver?.findElement(By.xpath(submitButtonPath)).click();

}

async function getRespomnces() {
    const msgAreaPath = '//*[@id="__next"]/div[1]/div[2]/div/main/div[1]/div/div/div'
    const msgHtml = await driver?.findElement(By.xpath(msgAreaPath)).getAttribute('innerHTML')
    // msg.
    return msgHtml || ''
}


async function extitSelenium() {
    await driver?.close()
}

function parseGptMsg(html: string | undefined) {
    if (!html) return
    writeFile('result.html', html, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    const $ = cheerio.load(html);
    $('*').map((index, element) => {
        console.log(index, $(element).text())
    })
}


async function isResponceComplete() {
    const regenrateButtonPath1 = '//*[@id="__next"]/div[1]/div[2]/div/main/div[2]/form/div/div[1]/div/div[2]/div/button'
    const regenrateButtonPath2 = '//*[@id="__next"]/div[1]/div/div/main/div[2]/form/div/div[2]/div/div[2]/div/button'

    try {
        await driver?.findElement(By.xpath(regenrateButtonPath1))
        return true;
    } catch {
        await driver?.findElement(By.xpath(regenrateButtonPath2))
        return true;

    } finally {
        return false;
    }
}

export { seleniumInit, loginToOpenAi, extitSelenium, messege, skipIntro, getRespomnces, sleep, isResponceComplete, loadSession,getUserSessionfromBrowsern,gotoPage }