import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/dist/types/server";

export async function POST(req: Request) {
  const webHook_key = process.env.WEBHOOK_SECRET;

  console.log("Key:= ", webHook_key);
  if (!webHook_key) {
    throw new Error("WebHook key not found");
  }

  const svix_id = req.headers.get("svix-id");
  const timeStramp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");

  console.log("svix-id:", svix_id);
  console.log("svix-timestamp:", timeStramp);
  console.log("svix-signature:", signature);

  if (!svix_id || !timeStramp || !signature) {
    console.log("Missing required headers");
    return new Response("Missing required headers", { status: 400 });
  }

  const body = await req.text(); 
  const webHook = new Webhook(webHook_key);

  try {

    let events = webHook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": timeStramp,
      "svix-signature": signature,
    }) as WebhookEvent;

    console.log("Webhook event passed verification");

    const { id } = events.data;
    const eveType = events.type;

    if (eveType === "user.created") {
      const { email_addresses, primary_email_address_id } = events.data;

      const primaryEmail = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );

      if (!primaryEmail) {
        return new Response("No Primary Email Found", { status: 400 });
      }

      // await db.user.create({ //db is an example database object
      //   data: {
      //     userId: id,
      //     email: primaryEmail,
      //   },
      // });

      console.log("New User created with email:", primaryEmail);
    }


    return new Response("Webhook received and processed", { status: 200 });
  } catch (error) {
    console.error("Error in verifying webhook:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
