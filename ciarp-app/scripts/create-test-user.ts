process.env.BETTER_AUTH_ALLOW_SIGN_UP = "true";

async function main() {
  const { auth } = await import("../lib/auth");
  const { closeMongoDb } = await import("../lib/mongodb");
  const email = process.env.CIARP_TEST_USER_EMAIL;
  const password = process.env.CIARP_TEST_USER_PASSWORD;
  const testUserName = process.env.CIARP_TEST_USER_NAME;

  if (!email || !password || !testUserName) {
    throw new Error(
      "Set CIARP_TEST_USER_EMAIL, CIARP_TEST_USER_PASSWORD and CIARP_TEST_USER_NAME.",
    );
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: testUserName,
        role: "Digitador",
        active: true,
      },
    });
    console.log("Test Digitador account created.");
  } catch (error) {
    if (
      error instanceof Error &&
      /already exists|already registered|duplicate/i.test(error.message)
    ) {
      console.log("Test Digitador account already exists.");
    } else {
      throw error;
    }
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await closeMongoDb();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Account creation failed.");
  process.exitCode = 1;
});
