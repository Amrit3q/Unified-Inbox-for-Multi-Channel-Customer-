import { NextRequest, NextResponse } from 'next/server'

import Twilio from 'twilio'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MessagingResponse = Twilio.twiml.MessagingResponse;

interface TwilioRequestBody {
    Body: string
    From: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const formData = await request.formData()

        const body: Partial<TwilioRequestBody> = Object.fromEntries(formData.entries())

        const incomingMessage = body.Body?.trim() || ''
        const fromNumber = body.From || 'Unknown'
        
        await prisma.message.create({
            data: {
                sender: fromNumber,
                content: incomingMessage
            },
        })
        console.log(`Received message from ${fromNumber}: ${incomingMessage}`)

        const twiml = new MessagingResponse()
        let replyText = ''

        if (incomingMessage.toLowerCase().includes('help')) {
      replyText = 'I can help you with your account. Please reply with "STATUS" or "MENU".';
    } else if (incomingMessage.toLowerCase().includes('status')) {
      replyText = 'Your service status is currently GREEN. All systems operational.';
    } else {
      replyText = `Thank you for your message: "${incomingMessage}". I'm a simple bot.`;
    }

    twiml.message(replyText);
    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    })

    } catch(error){
        console.log('Error processing Twilio webhook:', error)

        return new NextResponse('<Response><Message>An error occurred on the server</Message></Response>',{
            status: 500,
            headers: {
                'Content-Type': 'text/xml',
            },
        })
    }
}

export async function GET(): Promise<NextResponse> {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}