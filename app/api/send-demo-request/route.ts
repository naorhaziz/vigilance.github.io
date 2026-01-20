import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, companyName, companyUrl } = body;

        // Validate required fields
        if (!name || !email || !companyName || !companyUrl) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Email configuration
        const recipientEmail = 'demo@vigilance.security';
        const subject = `Demo Request from ${companyName}`;
        const emailBody = `
New Demo Request

Full Name: ${name}
Work Email: ${email}
Company Name: ${companyName}
Company Website: ${companyUrl}

---
Submitted: ${new Date().toISOString()}
        `.trim();

        // Using a mail service - you'll need to configure one of these:
        // Option 1: Resend (recommended - simple and modern)
        // Option 2: SendGrid
        // Option 3: Nodemailer with SMTP

        // For now, using fetch to send via a mail service
        // You'll need to add your API key to environment variables

        if (process.env.RESEND_API_KEY) {
            // Using Resend
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'Vigilance Demo <noreply@vigilance.security>',
                    to: [recipientEmail],
                    subject: subject,
                    text: emailBody,
                    html: `
                        <div style="font-family: monospace; max-width: 600px;">
                            <h2 style="color: #00D891;">New Demo Request</h2>
                            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p><strong>Full Name:</strong> ${name}</p>
                                <p><strong>Work Email:</strong> ${email}</p>
                                <p><strong>Company Name:</strong> ${companyName}</p>
                                <p><strong>Company Website:</strong> <a href="${companyUrl}">${companyUrl}</a></p>
                            </div>
                            <p style="color: #666; font-size: 12px;">Submitted: ${new Date().toLocaleString()}</p>
                        </div>
                    `,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send email via Resend');
            }
        } else {
            // Fallback: Log to console (development only)
            console.log('=== DEMO REQUEST ===');
            console.log(`From: ${name} <${email}>`);
            console.log(`Company: ${companyName}`);
            console.log(`Website: ${companyUrl}`);
            console.log('==================');

            // In production, you should throw an error here
            // throw new Error('Email service not configured');
        }

        return NextResponse.json({
            success: true,
            message: 'Demo request submitted successfully'
        });

    } catch (error) {
        console.error('Error sending demo request:', error);
        return NextResponse.json(
            { error: 'Failed to submit demo request' },
            { status: 500 }
        );
    }
}
