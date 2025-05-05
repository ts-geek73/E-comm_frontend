import { prisma } from '@/lib/prisma';
import { UserData } from "@/types/user";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";


function handleError(message: string, status: number) {
  console.error(message);
  return new Response(message, { status });
}


export async function POST(req: Request) {
  const webHook_key = process.env.WEBHOOK_SECRET;

  if (!webHook_key) {
    return handleError("WebHook secret key not found in environment variables", 500);
  }

  const svix_id = req.headers.get("svix-id");
  const timeStramp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");

  if (!svix_id || !timeStramp || !signature) {
    return new Response("Missing required headers", { status: 400 });
  }

  const body = await req.text();
  const webHook = new Webhook(webHook_key);

  try {
    const events = webHook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": timeStramp,
      "svix-signature": signature,
    }) as WebhookEvent;


    const eveType = events.type;

    switch (eveType) {
      case "user.created":
        try {
          const { id, email_addresses, primary_email_address_id, username, unsafe_metadata } = events.data;

          const primaryEmail = email_addresses.find(
            (email) => email.id === primary_email_address_id
          );

          if (!primaryEmail) {
            return handleError("No primary email found in user created event", 400);
          }

          const clerkId = unsafe_metadata?.clerkId || ''; 

          if (typeof clerkId !== 'string') {
            console.error("Invalid clerkId format, using fallback value.");
            return handleError("Invalid clerkId format", 400);
          }

          
          const userData: UserData = {

            email: primaryEmail.email_address,
            name: username || "",
            userId: id,
            clerkId: clerkId,  
            sessionId : ""
          };

          const emailExist = await prisma.users.findFirst({
            where: { email: userData.email },
          });
          if (emailExist) {
            return new Response('Email already exists', { status: 409 });
          }

          const idExist = await prisma.users.findFirst({
            where: { clerkId: userData.clerkId },
          });
          if (idExist) {
            return new Response('User ID already exists', { status: 409 });
          }

          await prisma.users.create( {data:userData});

          console.log(`New user created with email: ${primaryEmail.email_address}`);
          return new Response("User created successfully", { status: 201 });
        } catch (dbError: unknown) {
          console.error('Database error:', dbError);
        
          if (dbError instanceof Error) {
            return new Response(`Database error: ${dbError.message}`, { status: 500 });
          }
        
          return new Response('An unknown error occurred during database operation.', { status: 500 });
        }
        
        break;

      case "user.deleted":
        try {
          const { id } = events.data;
          console.log("Webhook delete Id:= ",id);
          

          const userToDelete = await prisma.users.findFirst({
            where: { userId: id },  
          });
          console.log(userToDelete);
          
      
          if (!userToDelete) {
            return new Response(`User with user ID ${id} not found`, { status: 404 });
          }

          await prisma.users.delete({
            where: { userId: id },  
          });

          console.log(`User with user ID ${id} deleted.`);
          return new Response("User deleted successfully", { status: 200 });
        } catch (dbError: unknown) {
          console.error('Database error during user deletion:', dbError);
        
          if (dbError instanceof Error) {
            return new Response(`Database error during user deletion: ${dbError.message}`, { status: 500 });
          }
        
          return new Response('An unknown error occurred during user deletion.', { status: 500 });
        }
        
        break;


      default:
        console.log(`Unhandled event type: ${eveType}`);
    }

    return new Response("Webhook received and processed", { status: 200 });
  } catch (error) {
    console.error("Error in verifying webhook:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
