const fs = require('fs');
const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');

const PATH_TO_CANCRY = '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary';

const chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {
    binary: PATH_TO_CANCRY,
    'args': [
        '--headless'
    ]
});

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();

    driver.get('https://www.google.com/')
    driver.findElement({name: 'q'}).sendKeys('webdriver')
    driver.findElement({name: 'btnG'}).click()

    driver.wait(webdriver.until.titleIs('webdriver - Google Search'), 1000)

    driver.takeScreenshot().then(base64png => {
        fs.writeFileSync('screenshot.png', new Buffer(base64png, 'base64'));
    })

driver.quit();