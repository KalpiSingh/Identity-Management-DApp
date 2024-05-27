// File: test/IdentityTest.js

const Identity = artifacts.require("Identity");

contract("Identity", (accounts) => {
  let identityInstance;

  beforeEach(async () => {
    identityInstance = await Identity.new();
  });

  it("should register and retrieve user details correctly", async () => {
    const name = "Alice";
    const email = "alice@example.com";

    // Register identity
    await identityInstance.registerIdentity(name, email);

    // Retrieve user details
    const [isVerified, retrievedName, retrievedEmail] = await identityInstance.displayDetails(name, email);

    // Assert
    assert.isTrue(isVerified, "User should be verified");
    assert.equal(retrievedName, name, "Retrieved name should match registered name");
    assert.equal(retrievedEmail, email, "Retrieved email should match registered email");
  });

  it("should return false for non-registered user", async () => {
    const name = "Bob";
    const email = "bob@example.com";

    // Retrieve user details
    const [isVerified, retrievedName, retrievedEmail] = await identityInstance.displayDetails(name, email);

    // Assert
    assert.isFalse(isVerified, "User should not be verified");
    assert.equal(retrievedName, "", "Retrieved name should be empty for non-registered user");
    assert.equal(retrievedEmail, "", "Retrieved email should be empty for non-registered user");
  });

  it("should not allow registering the same identity twice", async () => {
    const name = "Charlie";
    const email = "charlie@example.com";

    // Register identity
    await identityInstance.registerIdentity(name, email);

    // Try registering the same identity again
    try {
      await identityInstance.registerIdentity(name, email);
      assert.fail("Second registration should fail");
    } catch (error) {
      assert(error.message.includes("Identity already registered"), "Expected error message not found");
    }
  });

  it("should display correct details of already registered user", async () => {
    const name = "David";
    const email = "david@example.com";

    // Register identity
    await identityInstance.registerIdentity(name, email);

    // Retrieve user details
    const [isVerified, retrievedName, retrievedEmail] = await identityInstance.displayDetails(name, email);

    // Assert
    assert.isTrue(isVerified, "User should be verified");
    assert.equal(retrievedName, name, "Retrieved name should match registered name");
    assert.equal(retrievedEmail, email, "Retrieved email should match registered email");
  });
});
