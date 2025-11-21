# Contact Form Setup Guide

Your portfolio now has a fully functional contact form! Follow these simple steps to start receiving emails:

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Formspree Account
1. Go to [https://formspree.io](https://formspree.io)
2. Click "Get Started" or "Sign Up"
3. Create a free account (supports 50 submissions/month)

### Step 2: Create a New Form
1. After logging in, click "New Form"
2. Give it a name like "Portfolio Contact Form"
3. Enter your email address where you want to receive messages: **sohanakadiwala@gmail.com**
4. Click "Create Form"

### Step 3: Get Your Form ID
1. After creating the form, you'll see a form endpoint like:
   ```
   https://formspree.io/f/YOUR_FORM_ID
   ```
2. Copy the **YOUR_FORM_ID** part (it looks like: `xpznkjqw` or similar)

### Step 4: Update Your Portfolio
1. Open `index.html`
2. Find line 379 (in the contact form):
   ```html
   <form id="contact-form" class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Replace `YOUR_FORM_ID` with your actual form ID from Step 3
4. Save the file

### Step 5: Deploy & Test
1. Commit and push your changes:
   ```bash
   git add index.html
   git commit -m "Configure Formspree contact form"
   git push
   ```
2. Wait a minute for GitHub Pages to update
3. Visit your portfolio and test the contact form!

## ✨ Features

Your contact form includes:
- ✅ **Name** field
- ✅ **Email** field (with validation)
- ✅ **Subject** field
- ✅ **Message** textarea
- ✅ **Loading state** while sending
- ✅ **Success/Error messages**
- ✅ **Spam protection** (built into Formspree)
- ✅ **Responsive design** (works on all devices)
- ✅ **Violet theme** matching your portfolio

## 📧 What Happens When Someone Submits?

1. User fills out the form on your portfolio
2. Form data is sent to Formspree
3. Formspree forwards it to your email: **sohanakadiwala@gmail.com**
4. You receive an email with:
   - Sender's name
   - Sender's email (so you can reply)
   - Subject
   - Message
5. User sees a success message on your site

## 🎨 Customization Options

### Change Email Address
In Formspree dashboard, you can update the email address anytime.

### Add Auto-Reply
In Formspree settings, you can enable auto-replies to let people know you received their message.

### Add reCAPTCHA
For extra spam protection, enable reCAPTCHA in Formspree settings.

### Customize Success Message
Edit `script.js` line 328 to change the success message:
```javascript
statusDiv.textContent = '✓ Your custom message here!';
```

## 🆓 Free Plan Limits

Formspree free plan includes:
- 50 submissions per month
- Email notifications
- Spam filtering
- File uploads (up to 10MB)
- Export submissions

If you need more, upgrade to their paid plan ($10/month for 1000 submissions).

## 🔒 Privacy & Security

- Formspree is GDPR compliant
- All submissions are encrypted (HTTPS)
- No data is stored permanently (unless you enable it)
- Spam protection included

## 🐛 Troubleshooting

**Form not working?**
- Check that you replaced `YOUR_FORM_ID` with your actual ID
- Make sure the form is deployed to GitHub Pages
- Check browser console for errors

**Not receiving emails?**
- Check your spam folder
- Verify email address in Formspree dashboard
- Make sure you confirmed your Formspree account

**Getting spam?**
- Enable reCAPTCHA in Formspree settings
- Add honeypot field (Formspree has this built-in)

## 📞 Support

- Formspree Docs: https://help.formspree.io
- Formspree Support: support@formspree.io

---

**That's it!** Your contact form is ready to receive messages. 🎉
