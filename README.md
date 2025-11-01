# Unified-Inbox-for-Multi-Channel-Customer-


Next.js WhatsApp Dashboard (Twilio + Prisma + PostgreSQL)

A modern, full-stack application built with the Next.js App Router to receive and manage inbound WhatsApp messages using Twilio webhooks, storing data in a PostgreSQL database via Prisma ORM, and displaying messages in a real-time dashboard.

Features

1. Twilio Webhook Endpoint: Securely handles incoming POST requests from the Twilio WhatsApp API.

2. Data Persistence: Uses Prisma to connect to PostgreSQL and save message content and sender information.

3. Real-time Dashboard: A Next.js Server Component that fetches the latest messages directly from the database and displays them.

4. TwiML Response: Automatically sends a simple acknowledgment back to the sender via WhatsApp.


Architecture

The application follows a simple, robust architecture utilizing Next.js App Router features:

Inbound Message: A user sends a WhatsApp message to the Twilio number.

Twilio Webhook: Twilio sends a form-encoded POST request to the application's /api/whatsapp endpoint.

API Handler (route.ts): The handler processes the message, saves it to PostgreSQL via Prisma, and returns a TwiML response.

Dashboard (page.tsx): The server component fetches and displays the saved messages.


Setup and Installation

Follow these steps to get your local development environment running.

1. Prerequisites

You will need the following installed:

Node.js (v18+)

npm or yarn

A running PostgreSQL database instance (local or cloud-hosted).

A Twilio Account with an active WhatsApp Sandbox or number.

ngrok (or similar tool) to expose your local server to Twilio.

2. Install Dependencies

Install the core Next.js packages, the Twilio SDK, and Prisma.

npm install next react react-dom lucide-react twilio @prisma/client
npm install -D typescript @types/node @types/react prisma


3. Prisma Schema & Migration

Ensure your prisma/schema.prisma file is configured with the Message model and a primary key:

model Message {
    id          String    @id @default(uuid()) 
    sender      String
    content     String
    createdAt   DateTime  @default(now())

    @@index([sender])
}


Now, generate the necessary database tables:

npx prisma migrate dev --name init_whatsapp_messages


4. Environment Variables

Create a file named .env in the root of your project and add your database connection string and Twilio credentials:

# PostgreSQL Connection String
# Replace user, password, host, port, and database name
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# Twilio Credentials (Optional for now, but good practice)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token


5. Running the Application

Start the Next.js development server:

npm run dev


6. Configure Twilio Webhook

Since Twilio needs a public URL to send messages to, you must use ngrok to expose your local server (running on port 3000):

ngrok http 3000
