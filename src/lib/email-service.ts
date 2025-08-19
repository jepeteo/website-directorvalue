import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BusinessStatusEmailData {
  businessId: string;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  reason?: string;
  categoryName?: string;
}

interface WelcomeEmailData {
  userEmail: string;
  userName: string;
  businessName?: string;
}

interface ContactFormData {
  businessId: string;
  businessName: string;
  businessEmail: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export async function sendBusinessStatusEmail(data: BusinessStatusEmailData) {
  const { businessName, ownerName, ownerEmail, status, reason, categoryName } = data;

  let subject = '';
  let htmlContent = '';

  const baseUrl = process.env.NEXTAUTH_URL || 'https://directorvalue.com';

  switch (status) {
    case 'ACTIVE':
      subject = `🎉 Your business "${businessName}" has been approved!`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Congratulations!</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Your business is now live on Director Value!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hi ${ownerName},<br><br>
              Great news! Your business "<strong>${businessName}</strong>" has been approved and is now live on Director Value.
              ${categoryName ? `Your listing appears in the <strong>${categoryName}</strong> category.` : ''}
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #333; margin-top: 0;">What's next?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Your business is now visible to customers worldwide</li>
                <li>You can manage your listing in your dashboard</li>
                <li>Start receiving customer inquiries and reviews</li>
                <li>Update your business information anytime</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/dashboard/businesses" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Manage Your Business
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Thank you for choosing Director Value. We're excited to help you grow your business!
            </p>
          </div>
          
          <div style="background: #333; color: #fff; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">Director Value - Everything you need worldwide</p>
            <p style="margin: 5px 0 0 0; color: #ccc;">An MTX Studio Company</p>
          </div>
        </div>
      `;
      break;

    case 'REJECTED':
      subject = `Update on your business application - "${businessName}"`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Your business application needs attention</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hi ${ownerName},<br><br>
              We've reviewed your business application for "<strong>${businessName}</strong>", and unfortunately, we're unable to approve it at this time.
            </p>
            
            ${reason ? `
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3 style="color: #dc2626; margin-top: 0;">Reason for rejection:</h3>
                <p style="color: #666; margin-bottom: 0;">${reason}</p>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #333; margin-top: 0;">What can you do?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Review the feedback provided above</li>
                <li>Make necessary corrections to your business information</li>
                <li>Submit a new application when ready</li>
                <li>Contact our support team if you have questions</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/dashboard/businesses/new" 
                 style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Submit New Application
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              We appreciate your interest in Director Value and hope to work with you in the future.
            </p>
          </div>
          
          <div style="background: #333; color: #fff; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">Director Value - Everything you need worldwide</p>
            <p style="margin: 5px 0 0 0; color: #ccc;">An MTX Studio Company</p>
          </div>
        </div>
      `;
      break;

    case 'SUSPENDED':
      subject = `Important: Your business "${businessName}" has been temporarily suspended`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f59e0b; padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Business Suspended</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Your business has been temporarily suspended</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hi ${ownerName},<br><br>
              We're writing to inform you that your business "<strong>${businessName}</strong>" has been temporarily suspended from Director Value.
            </p>
            
            ${reason ? `
              <div style="background: #fef3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="color: #f59e0b; margin-top: 0;">Reason for suspension:</h3>
                <p style="color: #666; margin-bottom: 0;">${reason}</p>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #333; margin-top: 0;">To restore your listing:</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Address the issues mentioned above</li>
                <li>Contact our support team to discuss the situation</li>
                <li>Provide any necessary documentation or corrections</li>
                <li>Wait for our team to review and restore your listing</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:support@directorvalue.com" 
                 style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Contact Support
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              We value your business and hope to resolve this matter quickly.
            </p>
          </div>
          
          <div style="background: #333; color: #fff; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">Director Value - Everything you need worldwide</p>
            <p style="margin: 5px 0 0 0; color: #ccc;">An MTX Studio Company</p>
          </div>
        </div>
      `;
      break;

    default:
      // For PENDING or DRAFT status
      subject = `Your business application is being reviewed - "${businessName}"`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #3b82f6; padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Application Received</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for your submission!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hi ${ownerName},<br><br>
              We've received your business application for "<strong>${businessName}</strong>" and it's currently under review.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Our team will review your business information</li>
                <li>We'll check for completeness and accuracy</li>
                <li>You'll receive an email once the review is complete</li>
                <li>The review process typically takes 1-2 business days</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Thank you for choosing Director Value. We'll be in touch soon!
            </p>
          </div>
          
          <div style="background: #333; color: #fff; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">Director Value - Everything you need worldwide</p>
            <p style="margin: 5px 0 0 0; color: #ccc;">An MTX Studio Company</p>
          </div>
        </div>
      `;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Director Value <noreply@directorvalue.com>',
      to: [ownerEmail],
      subject,
      html: htmlContent,
    });

    if (error) {
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Failed to send business status email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const { userEmail, userName, businessName } = data;
  const baseUrl = process.env.NEXTAUTH_URL || 'https://directorvalue.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Director Value!</h1>
      </div>
      
      <div style="padding: 40px 20px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Everything you need worldwide</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Hi ${userName},<br><br>
          Welcome to Director Value! We're excited to have you join our global business directory platform.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="color: #333; margin-top: 0;">What you can do:</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Search and discover businesses worldwide</li>
            <li>Read and write reviews</li>
            <li>Connect with local services</li>
            ${businessName ? '<li>Manage your business listing</li>' : '<li>List your own business (VIP plan)</li>'}
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 10px;">
            Explore Directory
          </a>
          <a href="${baseUrl}/dashboard" 
             style="background: #764ba2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Your Dashboard
          </a>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Need help getting started? Check out our <a href="${baseUrl}/support" style="color: #667eea;">help center</a> or reply to this email.
        </p>
      </div>
      
      <div style="background: #333; color: #fff; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">Director Value - Everything you need worldwide</p>
        <p style="margin: 5px 0 0 0; color: #ccc;">An MTX Studio Company</p>
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Director Value <welcome@directorvalue.com>',
      to: [userEmail],
      subject: '🎉 Welcome to Director Value - Everything you need worldwide!',
      html: htmlContent,
    });

    if (error) {
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export async function sendContactFormRelay(data: ContactFormData) {
  const { businessName, businessEmail, senderName, senderEmail, subject, message } = data;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8f9fa; padding: 20px; border-bottom: 3px solid #667eea;">
        <h2 style="color: #333; margin: 0;">New inquiry for ${businessName}</h2>
        <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Via Director Value</p>
      </div>
      
      <div style="padding: 30px 20px; background: white;">
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin: 0 0 10px 0;">Contact Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${senderName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${senderEmail}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin: 0 0 10px 0;">Subject</h3>
          <p style="margin: 0; color: #666;">${subject}</p>
        </div>
        
        <div>
          <h3 style="color: #333; margin: 0 0 10px 0;">Message</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #667eea;">
            <p style="margin: 0; color: #666; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
        <p style="margin: 0;">This message was sent via your Director Value business listing.</p>
        <p style="margin: 5px 0 0 0;">
          <a href="https://directorvalue.com/dashboard" style="color: #667eea;">Manage your listing</a>
        </p>
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Director Value <contact@directorvalue.com>',
      to: [businessEmail],
      replyTo: [senderEmail],
      subject: `New inquiry: ${subject}`,
      html: htmlContent,
    });

    if (error) {
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Failed to send contact form relay email:', error);
    throw error;
  }
}
