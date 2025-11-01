// Email utility - can be extended with nodemailer or similar
export const sendEmail = async (to, subject, html) => {
  // Placeholder for email functionality
  // In production, integrate with nodemailer, SendGrid, or similar
  console.log(`📧 Email would be sent to: ${to}`);
  console.log(`Subject: ${subject}`);
  return true;
};

