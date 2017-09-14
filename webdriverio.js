const webdriverio = require('webdriverio');
const chromedriver = require('chromedriver');

// This should be the path to your Canary installation.
// I'm assuming Mac for the example.
const PATH_TO_CANARY = '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary';
const PORT = 9515;

chromedriver.start([
    '--url-base=wd/hub',
    `--port=${PORT}`,
    '--verbose'
]);

(async () => {

    const opts = {
        port: PORT,
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
                binary: PATH_TO_CANARY, // Screenshots require Chrome 60. Force Canary.
                args: ['--headless']
            }
        }
    };

    const browser = webdriverio.remote(opts).init();

    await browser.url('https://www.chromestatus.com/features');

    const title = await browser.getTitle();
    console.log(`Title: ${title}`);

    await browser.waitForText('.num-features', 3000);
    let numFeatures = await browser.getText('.num-features');
    console.log(`Chrome has ${numFeatures} total features`);

    await browser.setValue('input[type="search"]', 'CSS');
    console.log('Filtering features...');
    await browser.pause(1000);

    numFeatures = await browser.getText('.num-features');
    console.log(`Chrome has ${numFeatures} CSS features`);

    const buffer = await browser.saveScreenshot('screenshot.png');
    console.log('Saved screenshot...');

    chromedriver.stop();
    browser.end();

})();