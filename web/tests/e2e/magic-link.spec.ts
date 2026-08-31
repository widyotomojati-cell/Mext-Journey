import { expect, test } from "@playwright/test";

type MailpitSummary = {
  ID: string;
  To: Array<{ Address: string }>;
};

type MailpitMessage = {
  HTML: string;
};

function decodeHtml(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

test("magic link stays on the canonical host and opens today's quest", async ({
  request,
}, testInfo) => {
  const email = `magic-link-${testInfo.project.name}-${Date.now()}@example.com`;

  const loginResponse = await request.get("/login");
  const loginHtml = await loginResponse.text();
  const form: Record<string, string> = { email };

  for (const match of loginHtml.matchAll(
    /<input type="hidden" name="([^"]+)"(?: value="([^"]*)")?\s*\/>/g,
  )) {
    form[match[1]] = decodeHtml(match[2] ?? "");
  }

  expect(form["$ACTION_REF_1"]).toBeDefined();

  const submitResponse = await request.post("/login", {
    headers: { origin: "http://localhost:3000" },
    multipart: form,
  });
  expect(await submitResponse.text()).toContain("Magic link terkirim");

  let summary: MailpitSummary | undefined;
  await expect
    .poll(async () => {
      const response = await request.get(
        "http://127.0.0.1:54324/api/v1/messages",
      );
      const body = (await response.json()) as { messages: MailpitSummary[] };
      summary = body.messages.find(
        (message) => message.To[0]?.Address === email,
      );
      return Boolean(summary);
    })
    .toBe(true);

  const messageResponse = await request.get(
    `http://127.0.0.1:54324/api/v1/message/${summary!.ID}`,
  );
  const message = (await messageResponse.json()) as MailpitMessage;
  const href = message.HTML.match(/href="([^"]*\/auth\/v1\/verify[^"]+)"/)?.[1];

  expect(href).toBeTruthy();
  const magicLink = href!.replaceAll("&amp;", "&");
  const redirectTo = new URL(magicLink).searchParams.get("redirect_to");
  expect(redirectTo).toBe("http://localhost:3000/auth/callback");

  const callbackResponse = await request.get(magicLink);

  expect(callbackResponse.url()).toBe("http://localhost:3000/");
  expect(await callbackResponse.text()).toContain("Siap mulai, Dio?");
});
