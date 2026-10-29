/**
 * Uploads a file through Chrome's real file picker dialog on a public practice page
 * and checks the page confirms the upload.
 */
import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("File upload (Playwright alternative)", () => {
  it("uploads a file through the browser's file picker", async (context) => {
    const testdriver = TestDriver(context);

    // Create the file to upload inside the sandbox.
    await testdriver.exec("sh", 'echo "Uploaded by a TestDriver test" > /tmp/testdriver-upload.txt', 30000);

    // Open the practice upload page in Chrome.
    await testdriver.provision.chrome({ url: "https://the-internet.herokuapp.com/upload" });

    // Open the file picker the user would see.
    await testdriver.find("the Choose File button in the File Uploader form", { timeout: 30000 }).click();

    // Wait for the dialog, then type the file's path and confirm.
    await testdriver.find("the Open File dialog title at the top of the file picker window", { timeout: 15000 });
    await testdriver.pressKeys(["ctrl", "l"]);
    await testdriver.type("/tmp/testdriver-upload.txt");
    await testdriver.pressKeys(["enter"]);

    // Submit the form.
    await testdriver.find("the Upload button below the Choose File button").click();

    // Wait for the result page, then check the file name.
    await testdriver.find("the File Uploaded! heading", { timeout: 15000 });
    const result = await testdriver.assert(
      "the page shows the File Uploaded! heading with testdriver-upload.txt listed as the uploaded file",
    );
    expect(result).toBeTruthy();

    // Hold the final screen so the end of the replay shows the result.
    await testdriver.wait(3000);
  });
});
