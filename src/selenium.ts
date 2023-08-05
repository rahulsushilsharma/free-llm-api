import { Builder, Browser, By, until, WebDriver, WebElement, } from "selenium-webdriver";

// const options = new chrome.Options()
// options.addArguments("--remote-allow-origins='*'")
// options.addArguments('--disable-extensions')
// options.


let driver: WebDriver | null = null

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function seleniumInit() {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
}

/**
 * Navigates to the specified URL.
 * @param url - The URL to navigate to.
 */
async function gotoPage(url: string) {
    await driver?.get(url);
}


async function loginToOpenAi(id: string, pass: string) {
    await gotoPage('https://chat.openai.com/auth/login')
    const loginButtonPath1 = "//*[text()='Log in']"
    const loginButtonPath2 = "//*[text()='Log in']"
    const emailFeildPath = "//*[text()='Email address']"
    const continueButtonPath1 = '/html/body/div/main/section/div/div/div/div[1]/div/form/div[2]/button'
    const passwordFeildPath = '//*[@id="password"]'
    const continueButtonPath2 = '/html/body/div/main/section/div/div/div/form/div[3]/button'

    if (driver) {
        await sleep(1000)
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

async function extitSelenium() {
    await driver?.close()
}

export { seleniumInit, loginToOpenAi, extitSelenium, messege,skipIntro }