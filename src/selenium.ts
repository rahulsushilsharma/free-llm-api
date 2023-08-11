import { Builder, Browser, By, until, WebDriver, } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome.js'


let driver: WebDriver | null = null
const regenrateButtonPath1 = '//*[@id="__next"]/div[1]/div[2]/div/main/div[2]/form/div/div[1]/div/div[2]/div/button'
const regenrateButtonPath2 = '//*[@id="__next"]/div[1]/div/div/main/div[2]/form/div/div[2]/div/div[2]/div/button'
const sendButtonPath = '//*[@id="__next"]/div[1]/div[2]/div/main/div[2]/form/div/div[2]/button/span'
const loginButtonPath1 = "//*[text()='Log in']"
const loginButtonPath2 = "//*[text()='Log in']"
const emailFeildPath = "//*[text()='Email address']"
const continueButtonPath1 = '/html/body/div/main/section/div/div/div/div[1]/div/form/div[2]/button'
const passwordFeildPath = '//*[@id="password"]'
const continueButtonPath2 = '/html/body/div/main/section/div/div/div/form/div[3]/button'
const nextBtnPath = "//*[text()='Next']"
const doneBtnPath = "//*[text()='Done']"
const textAreaPath = '//*[@id="prompt-textarea"]'
const msgAreaPath = '//*[@id="__next"]/div[1]/div[2]/div/main/div[1]/div/div/div'
const submitButtonPath = '//*[@id="__next"]/div[1]/div[2]/div/main/div[2]/form/div/div[2]/button'


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms * Math.random()));

async function seleniumInit(profilePath: string, profileName: string) {

    const options = new chrome.Options()
    // options.addArguments("--remote-allow-origins='*'")
    // options.addArguments('--disable-extensions')
    // options.addArguments('--start-maximized')
    // options.addArguments("start-maximized"); // open Browser in maximized mode
    // options.addArguments("disable-infobars"); // disabling infobars
    // options.addArguments("--disable-extensions"); // disabling extensions
    // options.addArguments("--disable-gpu"); // applicable to windows os only
    // options.addArguments("--disable-dev-shm-usage"); // overcome limited resource problems
    // options.addArguments("--no-sandbox");
    // options.addArguments("--remote-debugging-port=9222")
    options.addArguments(profilePath)
    options.addArguments(profileName)
    options.addArguments('--disable-blink-features=AutomationControlled')
    driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
    await driver.executeScript(`
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
    `);

}

/**
 * Navigates to the specified URL.
 * @param url - The URL to navigate to.
 */
async function gotoPage(url: string) {
    await driver?.get(url);
}

async function loadSession(serializedCookies: any) {
    if (!driver) return;
    for (const cookie of serializedCookies) {
        await driver.manage().addCookie(cookie);
    }
}

async function getUserSessionfromBrowsern() {
    if (!driver) return;
    const cookies = await driver.manage().getCookies();
    const serializedCookies = JSON.stringify(cookies);
    return cookies;
}

async function loginToOpenAi(id: string, pass: string) {
    if (!driver) return


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
        const email = await driver.findElement({ xpath: emailFeildPath })
        await driver.wait(until.elementIsVisible(email));
        await email.sendKeys(id);
        await sleep(3000)
        await driver?.findElement(By.xpath(continueButtonPath1)).click();
        await sleep(3000)
        await driver?.findElement(By.xpath(passwordFeildPath)).sendKeys(pass);
        await sleep(3000)
        await driver?.findElement(By.xpath(continueButtonPath2)).click();
    }
}

async function skipIntro() {


    await sleep(3000)

    await driver?.findElement(By.xpath(nextBtnPath)).click();
    await sleep(1000)

    await driver?.findElement(By.xpath(nextBtnPath)).click();
    await sleep(1000)

    await driver?.findElement(By.xpath(doneBtnPath)).click();

}

async function messege(messege: string) {
    if (!driver) return

    const textArea = await driver.findElement(By.xpath(textAreaPath))
    for (const char of messege) {
        textArea.sendKeys(char);
        await sleep(700 * Math.random())
    }
    await driver?.findElement(By.xpath(submitButtonPath)).click();

}

async function getRespomnces() {
    const msgHtml = await driver?.findElement(By.xpath(msgAreaPath)).getAttribute('innerHTML')
    return msgHtml || ''
}


async function extitSelenium() {
    await driver?.close()
}

async function isResponceComplete() {

    try {
        await driver?.findElement(By.xpath(sendButtonPath))
        return true;
    } catch {
        return false;

    }
}

async function checkError() {
    if (!driver) return
    try {
        await driver.findElement(By.xpath(textAreaPath))
        return false

    } catch {
        return true
    }
}

export { seleniumInit, loginToOpenAi, extitSelenium, messege, skipIntro, getRespomnces, sleep, isResponceComplete, loadSession, getUserSessionfromBrowsern, gotoPage, checkError }