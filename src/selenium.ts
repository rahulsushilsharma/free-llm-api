import { Builder, Browser, By,until, } from "selenium-webdriver";

// const options = new chrome.Options()
// options.addArguments("--remote-allow-origins='*'")
// options.addArguments('--disable-extensions')
// options.

let driver:any = null

async function seleniumInit(){
  driver = await new Builder().forBrowser(Browser.CHROME).build();
}
