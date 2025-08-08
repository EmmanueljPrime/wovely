export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Privacy Policy</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <p>This Privacy Policy explains how Wovely collects, uses, and protects your personal data.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your data is collected for account management, order processing, and customer support.</li>
          <li>We do not share your data with third parties except as required by law or for service provision.</li>
          <li>You have the right to access, modify, or delete your personal data at any time.</li>
          <li>For any request regarding your data, please contact us via the contact page.</li>
        </ul>
        <p>By using our services, you accept this privacy policy.</p>
      </div>
    </div>
  );
}

