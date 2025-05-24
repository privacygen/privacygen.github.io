// Main application functionality
import './style.css';
import './js/header.js';

document.addEventListener('DOMContentLoaded', () => {
  const toggleAdvanced = document.querySelector('.toggle-advanced');
  const advancedContent = document.querySelector('.advanced-content');
  const toggleIcon = toggleAdvanced?.querySelector('.icon');
  const previewContent = document.querySelector('.preview-content');
  const generateButton = document.querySelector('.generator-form .btn-primary');
  const copyButton = document.querySelector('.preview-actions .btn-secondary');
  const form = document.querySelector('.generator-form');

  // Initialize FAQ functionality
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      // Show all answers by default
      answer.style.display = 'block';
    }
  });

  // Toggle advanced options
  toggleAdvanced?.addEventListener('click', () => {
    advancedContent?.classList.toggle('active');
    if (toggleIcon) {
      toggleIcon.style.transform = advancedContent?.classList.contains('active') 
        ? 'rotate(180deg)' 
        : 'rotate(0deg)';
      toggleAdvanced.querySelector('span:not(.icon)').textContent = 
        advancedContent?.classList.contains('active') ? 'Show Less' : 'Show More';
    }
  });

  // Format toggle functionality
  const formatBtns = document.querySelectorAll('.format-btn');
  let currentFormat = 'text';
  let lastGeneratedPolicy = '';

  function convertHtmlToPlainText(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Replace specific HTML elements with text equivalents
    const headings = tempDiv.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
      const level = heading.tagName[1];
      const prefix = '#'.repeat(level) + ' ';
      heading.textContent = `\n${prefix}${heading.textContent}\n`;
    });

    // Handle lists
    const lists = tempDiv.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const items = list.querySelectorAll('li');
      items.forEach((item, index) => {
        item.textContent = `\n• ${item.textContent}`;
      });
    });

    // Handle paragraphs
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.textContent = `\n${p.textContent}\n`;
    });

    // Handle div sections
    const sections = tempDiv.querySelectorAll('.policy-section');
    sections.forEach(section => {
      section.textContent = `\n${section.textContent}\n`;
    });

    // Get the text content and clean it up
    let text = tempDiv.textContent;
    text = text.replace(/\n\s*\n/g, '\n\n'); // Remove extra blank lines
    text = text.trim(); // Remove leading/trailing whitespace

    return text;
  }

  function updatePreview() {
    if (!lastGeneratedPolicy || !previewContent) return;
    
    if (currentFormat === 'text') {
      const plainText = convertHtmlToPlainText(lastGeneratedPolicy);
      previewContent.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace; line-height: 1.5;">${plainText}</pre>`;
    } else {
      previewContent.innerHTML = lastGeneratedPolicy;
    }
  }

  formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      formatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFormat = btn.dataset.format;
      if (previewContent?.classList.contains('active')) {
        updatePreview();
      }
    });
  });

  // Copy functionality for both formats
  const copyBtn = document.getElementById('copyBtn');
  const copyHtmlBtn = document.getElementById('copyHtmlBtn');

  copyBtn?.addEventListener('click', () => {
    if (!previewContent) return;
    const content = currentFormat === 'text' 
      ? previewContent.querySelector('pre')?.textContent || ''
      : previewContent.innerHTML;
    copyToClipboard(content, copyBtn);
  });

  copyHtmlBtn?.addEventListener('click', () => {
    if (!previewContent) return;
    const content = previewContent.innerHTML;
    copyToClipboard(content, copyHtmlBtn);
  });

  // Download functionality for both formats
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');

  downloadBtn?.addEventListener('click', () => {
    if (!previewContent) return;
    const content = currentFormat === 'text'
      ? previewContent.querySelector('pre')?.textContent || ''
      : convertHtmlToPlainText(previewContent.innerHTML);
    downloadFile(content, 'privacy-policy.txt');
  });

  downloadHtmlBtn?.addEventListener('click', () => {
    if (!previewContent) return;
    const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Privacy Policy</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    h1, h2, h3 { color: #1a1a1a; }
    .policy-section { margin-bottom: 30px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 10px; }
  </style>
</head>
<body>
  ${previewContent.innerHTML}
</body>
</html>`;
    downloadFile(content, 'privacy-policy.html');
  });

  function copyToClipboard(content, button) {
    navigator.clipboard.writeText(content).then(() => {
      const originalText = button.innerText;
      button.innerText = 'Copied!';
      setTimeout(() => {
        button.innerText = originalText;
      }, 2000);
    });
  }

  function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Handle form submission and preview generation
  generateButton?.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Close advanced options if open
    if (advancedContent?.classList.contains('active')) {
      advancedContent.classList.remove('active');
      if (toggleIcon) {
        toggleIcon.style.transform = 'rotate(0deg)';
        toggleAdvanced.querySelector('span:not(.icon)').textContent = 'Show More';
      }
    }
    
    // Website Information
    const websiteName = document.getElementById('websiteName')?.value;
    const websiteUrl = document.getElementById('websiteUrl')?.value;
    
    // Basic Information
    const appType = document.querySelector('input[name="appType"]:checked')?.value;
    const businessType = document.querySelector('input[name="businessType"]:checked')?.value;
    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const address = document.getElementById('address')?.value;
    const contactFormUrl = document.getElementById('contactFormUrl')?.value;

    // Collected Data
    const collectedData = Array.from(document.querySelectorAll('input[name="collectedData"]:checked'))
      .map(checkbox => checkbox.value);

    // Collection Methods
    const collectionMethods = Array.from(document.querySelectorAll('input[name="collectionMethod"]:checked'))
      .map(checkbox => checkbox.value);

    // Data Usage
    const dataUsage = Array.from(document.querySelectorAll('input[name="dataUsage"]:checked'))
      .map(checkbox => checkbox.value);

    // Compliance
    const compliance = Array.from(document.querySelectorAll('input[name="compliance"]:checked'))
      .map(checkbox => checkbox.value);

    // Additional Options
    const additional = Array.from(document.querySelectorAll('input[name="additional"]:checked'))
      .map(checkbox => checkbox.value);

    if (!websiteName || !websiteUrl || !appType || !businessType || !email) {
      alert('Please fill in all required fields (Website Name, Website URL, App Type, Business Type, and Email)');
      return;
    }

    lastGeneratedPolicy = generatePrivacyPolicy({
      websiteName,
      websiteUrl,
      appType,
      businessType,
      email,
      phone,
      address,
      contactFormUrl,
      collectedData,
      collectionMethods,
      dataUsage,
      compliance,
      additional
    });

    if (previewContent) {
      previewContent.classList.add('active');
      updatePreview();

      // Scroll preview into view
      previewContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Privacy Policy Generation Functions
function generatePrivacyPolicy(data) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <div class="privacy-policy">
      <h1>Privacy Policy</h1>
      <p class="effective-date">Last Updated: ${date}</p>
      
      ${generateIntroductionSection(data)}
      ${generateBusinessInfoSection(data)}
      ${generateContactSection(data)}
      ${generateDataCollectionSection(data.collectedData)}
      ${generateCollectionMethodsSection(data.collectionMethods)}
      ${generateDataUsageSection(data.dataUsage)}
      ${generateDataRetentionSection()}
      ${generateDataSecuritySection()}
      ${generateUserRightsSection()}
      ${generateComplianceSection(data.compliance)}
      ${generateAdditionalSections(data.additional)}
      ${generateUpdatesSection()}
      ${generateContactUsSection(data)}

      <div class="policy-footer">
        <p>Last updated: ${date}</p>
      </div>
    </div>
  `;
}

function generateIntroductionSection(data) {
  return `
    <div class="policy-section">
      <h2>1. Introduction</h2>
      <p>Welcome to ${data.websiteName} (${data.websiteUrl}). We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
      <p>By accessing or using our service, you agree to this Privacy Policy. If you do not agree with any part of this policy, please do not use our service.</p>
      <p>This policy applies to all information collected through our:</p>
      <ul>
        <li>${data.websiteName} (${data.websiteUrl})</li>
        <li>Any related services, sales, marketing, or events</li>
      </ul>
    </div>
  `;
}

function generateBusinessInfoSection(data) {
  return `
    <div class="policy-section">
      <h2>2. Business Information</h2>
      <p>We operate as a ${formatBusinessType(data.businessType)}. This privacy policy applies to all services and operations of our business.</p>
      <p>Our commitment to privacy extends across all aspects of our operations, and we ensure compliance with applicable data protection laws and regulations.</p>
    </div>
  `;
}

function generateContactSection(data) {
  let contactMethods = [];
  
  if (data.email) {
    contactMethods.push(`<li>Email: ${data.email}</li>`);
  }
  if (data.phone) {
    contactMethods.push(`<li>Phone: ${data.phone}</li>`);
  }
  if (data.address) {
    contactMethods.push(`<li>Address: ${data.address}</li>`);
  }
  if (data.contactFormUrl) {
    contactMethods.push(`<li>Online Contact Form: <a href="${data.contactFormUrl}" target="_blank" rel="noopener noreferrer">Contact Us</a></li>`);
  }

  return `
    <div class="policy-section">
      <h2>3. Contact Information</h2>
      <p>You can contact us through any of the following methods:</p>
      <ul class="contact-info">
        ${contactMethods.join('\n')}
      </ul>
    </div>
  `;
}

function generateDataCollectionSection(collectedData) {
  if (!collectedData?.length) return '';
  
  const dataCategories = {
    personal: ['name', 'email', 'phone'],
    financial: ['payment'],
    technical: ['ip', 'cookies'],
    usage: ['location', 'files', 'social']
  };

  let sections = '';
  
  if (collectedData.some(data => dataCategories.personal.includes(data))) {
    sections += `
      <h3>Personal Information</h3>
      <p>We collect the following personal information:</p>
      <ul>
        ${collectedData.filter(data => dataCategories.personal.includes(data))
          .map(data => `<li>${formatDataType(data)}</li>`).join('')}
      </ul>
    `;
  }

  if (collectedData.some(data => dataCategories.financial.includes(data))) {
    sections += `
      <h3>Financial Information</h3>
      <p>For payment processing, we collect:</p>
      <ul>
        ${collectedData.filter(data => dataCategories.financial.includes(data))
          .map(data => `<li>${formatDataType(data)}</li>`).join('')}
      </ul>
    `;
  }

  if (collectedData.some(data => dataCategories.technical.includes(data))) {
    sections += `
      <h3>Technical Information</h3>
      <p>We automatically collect certain technical information:</p>
      <ul>
        ${collectedData.filter(data => dataCategories.technical.includes(data))
          .map(data => `<li>${formatDataType(data)}</li>`).join('')}
      </ul>
    `;
  }

  if (collectedData.some(data => dataCategories.usage.includes(data))) {
    sections += `
      <h3>Usage Information</h3>
      <p>We may collect additional usage-related information:</p>
      <ul>
        ${collectedData.filter(data => dataCategories.usage.includes(data))
          .map(data => `<li>${formatDataType(data)}</li>`).join('')}
      </ul>
    `;
  }

  return `
    <div class="policy-section">
      <h2>4. Information We Collect</h2>
      ${sections}
    </div>
  `;
}

function generateCollectionMethodsSection(methods) {
  if (!methods?.length) return '';

  return `
    <div class="policy-section">
      <h2>5. How We Collect Information</h2>
      <p>We collect information through various methods and technologies:</p>
      <ul>
        ${methods.map(method => `
          <li>
            <strong>${formatMethodType(method)}:</strong> 
            ${getMethodDescription(method)}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function generateDataUsageSection(usage) {
  if (!usage?.length) return '';

  return `
    <div class="policy-section">
      <h2>6. How We Use Your Information</h2>
      <p>We use the collected information for the following legitimate business purposes:</p>
      <ul>
        ${usage.map(use => `
          <li>
            <strong>${formatUsageType(use)}:</strong> 
            ${getUsageDescription(use)}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function generateDataRetentionSection() {
  return `
    <div class="policy-section">
      <h2>7. Data Retention</h2>
      <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. The criteria used to determine our retention periods include:</p>
      <ul>
        <li>The length of time we have an ongoing relationship with you</li>
        <li>Whether there is a legal obligation to which we are subject</li>
        <li>Whether retention is advisable in light of our legal position (such as applicable statutes of limitations, litigation, or regulatory investigations)</li>
      </ul>
      <p>When we no longer need personal information, we securely delete or destroy it.</p>
    </div>
  `;
}

function generateDataSecuritySection() {
  return `
    <div class="policy-section">
      <h2>8. Data Security</h2>
      <p>We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. These measures include:</p>
      <ul>
        <li>Encryption of data in transit and at rest</li>
        <li>Regular security assessments and audits</li>
        <li>Access controls and authentication procedures</li>
        <li>Employee training on data protection and security</li>
      </ul>
      <p>While we strive to protect your personal information, please note that no method of transmission over the Internet or electronic storage is 100% secure.</p>
    </div>
  `;
}

function generateUserRightsSection() {
  return `
    <div class="policy-section">
      <h2>9. Your Rights and Choices</h2>
      <p>You have certain rights regarding your personal information:</p>
      <ul>
        <li><strong>Access:</strong> Request access to your personal information</li>
        <li><strong>Correction:</strong> Request correction of inaccurate personal information</li>
        <li><strong>Deletion:</strong> Request deletion of your personal information</li>
        <li><strong>Restriction:</strong> Request restriction of processing of your personal information</li>
        <li><strong>Data Portability:</strong> Request transfer of your personal information</li>
        <li><strong>Objection:</strong> Object to processing of your personal information</li>
      </ul>
      <p>To exercise any of these rights, please contact us using the information provided in the Contact Us section.</p>
    </div>
  `;
}

function generateComplianceSection(compliance) {
  if (!compliance?.length) return '';

  return `
    <div class="policy-section">
      <h2>10. Legal Compliance</h2>
      <p>Our privacy practices comply with applicable privacy laws and regulations, including:</p>
      <ul>
        ${compliance.map(reg => `
          <li>
            <strong>${formatComplianceType(reg)}:</strong> 
            ${getComplianceDescription(reg)}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function generateAdditionalSections(additional) {
  if (!additional?.length) return '';

  let sections = '';

  if (additional.includes('cookie-policy')) {
    sections += `
      <div class="policy-section">
        <h2>11. Cookie Policy</h2>
        <p>We use cookies and similar tracking technologies to enhance your browsing experience and analyze site usage. Cookies are small text files stored on your device.</p>
        <h3>Types of Cookies We Use:</h3>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          <li><strong>Marketing Cookies:</strong> Used for targeted advertising</li>
        </ul>
        <p>You can control cookie preferences through your browser settings.</p>
      </div>
    `;
  }

  if (additional.includes('children')) {
    sections += `
      <div class="policy-section">
        <h2>Children's Privacy</h2>
        <p>We collect information from children under 13 years of age with verifiable parental consent. We comply with the Children's Online Privacy Protection Act (COPPA) and take special precautions to protect children's privacy.</p>
        <h3>Parental Rights:</h3>
        <ul>
          <li>Review your child's personal information</li>
          <li>Request deletion of your child's personal information</li>
          <li>Refuse further collection or use of your child's information</li>
        </ul>
      </div>
    `;
  }

  return sections;
}

function generateUpdatesSection() {
  return `
    <div class="policy-section">
      <h2>12. Updates to This Privacy Policy</h2>
      <p>We reserve the right to update this Privacy Policy at any time. Changes will be effective immediately upon posting the updated policy on our service.</p>
      <p>We will notify you of any material changes by:</p>
      <ul>
        <li>Updating the "Last Updated" date at the top of this Privacy Policy</li>
        <li>Sending an email notification (if we have your contact information)</li>
        <li>Displaying a prominent notice on our service</li>
      </ul>
      <p>Your continued use of our service after any changes to this Privacy Policy constitutes your acceptance of such changes.</p>
    </div>
  `;
}

function generateContactUsSection(data) {
  return `
    <div class="policy-section">
      <h2>13. Contact Us</h2>
      <p>If you have questions, concerns, or requests related to this Privacy Policy or our privacy practices, please contact us:</p>
      <ul class="contact-info">
        ${data.email ? `<li>Email: ${data.email}</li>` : ''}
        ${data.phone ? `<li>Phone: ${data.phone}</li>` : ''}
        ${data.address ? `<li>Mailing Address: ${data.address}</li>` : ''}
        ${data.contactFormUrl ? `<li>Contact Form: <a href="${data.contactFormUrl}" target="_blank" rel="noopener noreferrer">Online Contact Form</a></li>` : ''}
      </ul>
      <p>We will respond to your request within a reasonable timeframe.</p>
    </div>
  `;
}

function formatAppType(type) {
  const types = {
    'website': 'our website',
    'mobile-app': 'our mobile application',
    'saas': 'our web application/service',
    'blog': 'our blog/personal website'
  };
  return types[type] || type;
}

function formatBusinessType(type) {
  const types = {
    'individual': 'Individual/Freelancer',
    'small-business': 'Small Business',
    'corporation': 'Company/Corporation',
    'non-profit': 'Non-Profit Organization'
  };
  return types[type] || type;
}

function formatDataType(type) {
  const types = {
    'name': 'Full name',
    'email': 'Email address',
    'phone': 'Phone number',
    'payment': 'Payment information (e.g., credit card details)',
    'ip': 'IP address and device information',
    'cookies': 'Cookies and usage data',
    'location': 'Geographic location data',
    'files': 'Uploaded files and media content',
    'social': 'Social media profile information'
  };
  return types[type] || type;
}

function formatMethodType(type) {
  const types = {
    'forms': 'Direct User Input',
    'cookies': 'Cookies and Tracking',
    'analytics': 'Analytics Tools',
    'payment': 'Payment Processing',
    'newsletter': 'Newsletter Subscriptions',
    'thirdparty': 'Third-Party Services'
  };
  return types[type] || type;
}

function getMethodDescription(type) {
  const descriptions = {
    'forms': 'Information you voluntarily provide through our forms and interfaces',
    'cookies': 'Automatic collection through cookies and similar technologies',
    'analytics': 'Usage data collected through analytics services',
    'payment': 'Transaction data processed through secure payment providers',
    'newsletter': 'Information submitted through newsletter signup forms',
    'thirdparty': 'Data collected through integrated third-party services'
  };
  return descriptions[type] || '';
}

function formatUsageType(type) {
  const types = {
    'support': 'Customer Support',
    'improvement': 'Service Improvement',
    'marketing': 'Marketing Communications',
    'legal': 'Legal Compliance',
    'payment': 'Payment Processing'
  };
  return types[type] || type;
}

function getUsageDescription(type) {
  const descriptions = {
    'support': 'To provide customer service and respond to your inquiries',
    'improvement': 'To analyze usage patterns and improve our services',
    'marketing': 'To send relevant updates and promotional materials',
    'legal': 'To comply with legal obligations and protect our rights',
    'payment': 'To process your payments and prevent fraudulent transactions'
  };
  return descriptions[type] || '';
}

function formatComplianceType(type) {
  const types = {
    'gdpr': 'General Data Protection Regulation (GDPR)',
    'ccpa': 'California Consumer Privacy Act (CCPA)',
    'coppa': "Children's Online Privacy Protection Act (COPPA)",
    'pipeda': 'Personal Information Protection and Electronic Documents Act (PIPEDA)'
  };
  return types[type] || type;
}

function getComplianceDescription(type) {
  const descriptions = {
    'gdpr': 'Provides rights for EU residents and regulates data processing',
    'ccpa': 'Gives California residents control over their personal information',
    'coppa': 'Protects privacy of children under 13 years old',
    'pipeda': 'Governs how private sector organizations handle personal information'
  };
  return descriptions[type] || '';
}
