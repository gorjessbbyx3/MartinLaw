
// Reference: javascript_sendgrid integration blueprint
import { MailService } from '@sendgrid/mail';

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@masonmartinlaw.com";
const FROM_NAME = "Mason Martin Law";

// Initialize SendGrid service
let mailService: MailService | null = null;

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  try {
    mailService = new MailService();
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('SendGrid email service initialized');
  } catch (error) {
    console.error('Failed to initialize SendGrid:', error);
  }
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // If SendGrid is not configured, fall back to development logging
    if (!mailService || !process.env.SENDGRID_API_KEY) {
      console.log("SendGrid not configured - email would be sent:", {
        to: params.to,
        from: params.from,
        subject: params.subject,
        textPreview: params.text?.substring(0, 100) + "..."
      });
      return true;
    }

    // Send email using SendGrid
    await mailService.send({
      to: params.to,
      from: `${FROM_NAME} <${params.from}>`,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    
    // Fallback to console logging to not block application flow
    console.log("Email failed to send but would contain:", {
      to: params.to,
      from: params.from,
      subject: params.subject,
      textPreview: params.text?.substring(0, 100) + "..."
    });
    return true; // Return true to not block the application flow
  }
}

export function generateConsultationConfirmationEmail(
  clientName: string,
  consultationType: string,
  scheduledDate: string,
  caseType?: string
) {
  const subject = "Consultation Confirmation - Mason Martin Law";
  
  const text = `
Dear ${clientName},

Thank you for scheduling a consultation with Mason Martin Law. We have received your request and will contact you within 24 hours to confirm the details.

Consultation Details:
- Type: ${consultationType}
- Preferred Date/Time: ${scheduledDate}
${caseType ? `- Case Type: ${caseType}` : ''}

Our office will reach out to you soon to finalize the scheduling and provide any additional information you may need.

If you have any questions in the meantime, please don't hesitate to contact our office at (808) 555-0123.

Thank you for choosing Mason Martin Law for your legal needs.

Best regards,
Mason Martin Law
Licensed Attorney in Hawaii
Specializing in Civil Litigation, Trial Advocacy, Appellate Law, and Military Law

Office: (808) 555-0123
Email: info@masonmartinlaw.com
Website: www.masonmartinlaw.com
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background-color: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Mason Martin Law</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Licensed Attorney in Hawaii</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e3a8a; margin-top: 0;">Consultation Confirmation</h2>
        
        <p>Dear ${clientName},</p>
        
        <p>Thank you for scheduling a consultation with Mason Martin Law. We have received your request and will contact you within 24 hours to confirm the details.</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #d4a574;">
          <h3 style="margin-top: 0; color: #1e3a8a;">Consultation Details:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Type:</strong> ${consultationType}</li>
            <li><strong>Preferred Date/Time:</strong> ${scheduledDate}</li>
            ${caseType ? `<li><strong>Case Type:</strong> ${caseType}</li>` : ''}
          </ul>
        </div>
        
        <p>Our office will reach out to you soon to finalize the scheduling and provide any additional information you may need.</p>
        
        <p>If you have any questions in the meantime, please don't hesitate to contact our office at <strong>(808) 555-0123</strong>.</p>
        
        <p>Thank you for choosing Mason Martin Law for your legal needs.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;"><strong>Mason Martin Law</strong></p>
          <p style="margin: 5px 0;">Specializing in Civil Litigation, Trial Advocacy, Appellate Law, and Military Law</p>
          <p style="margin: 5px 0;">Office: (808) 555-0123</p>
          <p style="margin: 5px 0;">Email: info@masonmartinlaw.com</p>
          <p style="margin: 5px 0;">Website: www.masonmartinlaw.com</p>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export function generateClientPortalAccessEmail(
  clientName: string,
  accessToken: string,
  expiresAt: Date
) {
  const subject = "Secure Client Portal Access - Mason Martin Law";
  const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/client-portal/${accessToken}`;
  
  const text = `
Dear ${clientName},

Your secure client portal access has been generated. You can use the link below to access your case information, consultations, and invoices.

Access Link: ${portalUrl}

This link will expire on ${expiresAt.toLocaleDateString()} at ${expiresAt.toLocaleTimeString()}.

Through the client portal, you can:
- View your case status and updates
- Review consultation history
- Access invoices and billing information
- Download important documents

For security reasons, this link is unique to you and should not be shared with others.

If you have any questions or need assistance accessing your portal, please contact our office at (808) 555-0123.

Best regards,
Mason Martin Law
Licensed Attorney in Hawaii

Office: (808) 555-0123
Email: info@masonmartinlaw.com
Website: www.masonmartinlaw.com
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background-color: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Mason Martin Law</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Licensed Attorney in Hawaii</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e3a8a; margin-top: 0;">Secure Client Portal Access</h2>
        
        <p>Dear ${clientName},</p>
        
        <p>Your secure client portal access has been generated. You can use the button below to access your case information, consultations, and invoices.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${portalUrl}" style="background-color: #d4a574; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access Client Portal</a>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; font-size: 14px;"><strong>Security Notice:</strong> This link will expire on ${expiresAt.toLocaleDateString()} at ${expiresAt.toLocaleTimeString()}.</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e3a8a;">Through the client portal, you can:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>View your case status and updates</li>
            <li>Review consultation history</li>
            <li>Access invoices and billing information</li>
            <li>Download important documents</li>
          </ul>
        </div>
        
        <p style="font-size: 14px; color: #666;">For security reasons, this link is unique to you and should not be shared with others.</p>
        
        <p>If you have any questions or need assistance accessing your portal, please contact our office at <strong>(808) 555-0123</strong>.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;"><strong>Mason Martin Law</strong></p>
          <p style="margin: 5px 0;">Office: (808) 555-0123</p>
          <p style="margin: 5px 0;">Email: info@masonmartinlaw.com</p>
          <p style="margin: 5px 0;">Website: www.masonmartinlaw.com</p>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export async function sendConsultationConfirmation(
  clientEmail: string,
  clientName: string,
  consultationType: string,
  scheduledDate: string,
  caseType?: string
): Promise<boolean> {
  const emailContent = generateConsultationConfirmationEmail(
    clientName,
    consultationType,
    scheduledDate,
    caseType
  );

  return await sendEmail({
    to: clientEmail,
    from: FROM_EMAIL,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });
}

export async function sendClientPortalAccess(
  clientEmail: string,
  clientName: string,
  accessToken: string,
  expiresAt: Date
): Promise<boolean> {
  const emailContent = generateClientPortalAccessEmail(
    clientName,
    accessToken,
    expiresAt
  );

  return await sendEmail({
    to: clientEmail,
    from: FROM_EMAIL,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });
}
