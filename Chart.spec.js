const { Builder, Capabilities, By, until } = require("selenium-webdriver");
const { Eyes, ConsoleLogHandler, Target } = require("@applitools/eyes-selenium");
const { selectOption } = require("./testHelper");

(async () => {
    //open a new Chrome brower object
    const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

    //Initialize the eyes SDK and set your private API key
    const eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
    eyes.setLogHandler(new ConsoleLogHandler(false));

    try {
        //Initialize test, set the browser view point size to 800x600
        await eyes.open(driver, "BC platform medical chart App",
            "Test edit page to create new chart",
            {
                width: 1400,
                height: 700
            })

        //Start testing
        //Nevigate the browser to the localhost:3000
        await driver.get("http://localhost:3000/edit")

        //Take a visual checkpoint
        await eyes.check("Edit", Target.window())

        //Locate  "configration options"
        const confOptsElement = await driver.wait(until.elementsLocated(By.className("MuiInput-input")), 500)
        if (confOptsElement) {
            const confOpt1 = confOptsElement[0]
            const confOpt2 = confOptsElement[1]
            const confOpt3 = confOptsElement[2]
            const confOpt4 = confOptsElement[3]
            console.log(confOpt1)
            //Select for configuration
            await selectOption(driver, confOpt1, "MuiListItem-button", 1)
            await selectOption(driver, confOpt2, "MuiListItem-button", 1)
            await selectOption(driver, confOpt3, "MuiListItem-button", 1)
            await selectOption(driver, confOpt4, "MuiListItem-button", 1)
            //Save configuration
            await driver.findElement(By.className("MuiButton-containedPrimary")).click();

            //Scroll to chart
            const chart = await driver.findElement(By.className("svg-container"))
            await driver.executeScript("arguments[0].scrollIntoView()", chart);
        }

        //Take a visual checkpoint
        await eyes.check("New chart", Target.window())

        //End the test
        await eyes.close()
    }
    catch (error) {
        console.log(error)
    }
    finally {
        //Quit browser 
        // await driver.quit();

        //Close eyes if eyes.closer() is not reached
        await eyes.abortIfNotClosed();
    }
})()