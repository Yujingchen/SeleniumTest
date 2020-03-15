const { selectOption } = require("./testHelper.js");
const { Builder, Capabilities, By, until } = require("selenium-webdriver");
const { Eyes, ConsoleLogHandler, Target } = require("@applitools/eyes-selenium");

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
            "Open Infection table, locate subject NA06991",
            {
                width: 1400,
                height: 700
            })

        //Start testing
        //Nevigate the browser to the localhost:3000
        await driver.get("http://localhost:3000/dashboard")

        //Take a visual checkpoint
        await eyes.check("Dashboard", Target.window())

        //Locate table option div and click
        const tableTabElement = await driver.findElement(By.className("MuiInput-input"));
        console.log(tableTabElement)
        if (tableTabElement) {
            const text = await tableTabElement.getText();
            console.log("\nTable dataset option found!\n");

            //Locate "Affection" option and click 
            await selectOption(driver, tableTabElement, "MuiListItem-button", 1)
        }

        // Take a visual checkpoint
        await eyes.check("Infection table", Target.window())

        //Locate first row, find subject "NA06991"
        const AffectionTableColElements = await driver.wait(until.elementsLocated(By.className("MuiTableCell-paddingNone")), 20000);
        await driver.executeScript("arguments[0].scrollIntoView()", AffectionTableColElements[0]);
        if (AffectionTableColElements && AffectionTableColElements.length > 0) {
            const text = await AffectionTableColElements[1].getText()
            if (text && text == "NA06991") {
                console.log("\nSubject NA06991 found!\n")
            }
        }

        //End the test
        await eyes.close()
    }
    catch {
    }
    finally {
        // Quit browser
        await driver.quit();

        //Close eyes if eyes.closer() is not reached
        await eyes.abortIfNotClosed();
    }
})()