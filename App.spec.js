const { Builder, Capabilities, By, until } = require("selenium-webdriver");
const { Eyes, ConsoleLogHandler, Target } = require("@applitools/eyes-selenium");
const { selectOption } = require("./testHelper.js");

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
            "Test nevigation link, dashboard table and create new chart",
            {
                width: 1400,
                height: 700
            })

        //Start testing
        //Nevigate the browser to the localhost:3000
        await driver.get("http://localhost:3000/dashboard")

        //Take a visual checkpoint
        // await eyes.check("Dashboard", Target.window())

        //Locate table option div and click
        const tableTabElement = await driver.findElement(By.className("MuiInput-input"));
        console.log(tableTabElement)

        if (tableTabElement) {
            console.log("\nTable dataset option found!\n");

            //Locate "Affection" option and click 
            await selectOption(driver, tableTabElement, "MuiListItem-button", 1)
        }

        // Take a visual checkpoint
        // await eyes.check("Infection table", Target.window())

        //Locate first row, find subject "NA06991"
        const AffectionTableColElements = await driver.wait(until.elementsLocated(By.className("MuiTableCell-paddingNone")), 5000);
        await driver.executeScript("arguments[0].scrollIntoView()", tableTabElement);
        if (AffectionTableColElements && AffectionTableColElements.length > 0) {
            const text = await AffectionTableColElements[1].getText()
            if (text && text == "NA06991") {
                console.log("\nSubject NA06991 found!\n")
            }
        }
        // Take a visual checkpoint
        // await eyes.check("Infection table", Target.window())



        //Locate the Edit tab in top nevigator and mouse click on tab
        const editTabElement = await driver.findElement(By.linkText("EDIT"))
        if (editTabElement) {
            const text = await editTabElement.getText()
            if (text && text == "EDIT")
                console.log("Found EDIT tab, click on tab!")
            await driver.wait(editTabElement.click(), 20000)
        }

        //Take a visual checkpoint
        // await eyes.check("Edit", Target.window())

        //Locate H2 "Title Configration Options"
        const h2Element = await driver.wait(until.elementLocated(By.tagName("h2")), 10000)
        if (h2Element) {
            const text = await h2Element.getText()
            if (text && text == "Configuration Options") {
                console.log("Configuration Options is found!")
            }
        }

        //Locate  "configration options"
        const confOptsElement = await driver.wait(until.elementsLocated(By.className("MuiInput-input")), 500)
        if (confOptsElement) {
            const confOpt1 = confOptsElement[0]
            const confOpt2 = confOptsElement[1]
            const confOpt3 = confOptsElement[2]
            const confOpt4 = confOptsElement[3]
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
        // await eyes.check("New chart", Target.window())

        //End the test
        await eyes.close()
    }
    catch (error) {
        console.log(error)
    }
    finally {
        //Quit browser 
        await driver.quit();

        //Close eyes if eyes.closer() is not reached
        await eyes.abortIfNotClosed();
    }
})()