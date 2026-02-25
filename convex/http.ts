import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("missing CLERK_WEBHOOK_SECRET environment variable");
    }

    //check headers
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error Occured - missing svix headers", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    //verify the webhook
    const weh = new Webhook(webhookSecret);
    let evt: any;
    try {
      evt = weh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (error) {
      console.error("Error verifying webhook:", error);
      return new Response("Error Occured - invalid webhook signature", {
        status: 400,
      });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.user.createUser, {
          username: email.split("@")[0],
          fullname: name,
          email,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Error Occured - failed to create user", {
          status: 500,
        });
      }
    }

    return new Response("Webhook received successfully", { status: 200 });
  }),
});

export default http;
