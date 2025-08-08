export default function LegalNoticePage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Legal Notice</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <p><strong>Company Name:</strong> Wovely</p>
        <p><strong>Address:</strong> [Your company address]</p>
        <p><strong>Phone:</strong> [Your company phone]</p>
        <p><strong>Email:</strong> [Your contact email]</p>
        <p><strong>SIRET:</strong> [Your SIRET number]</p>
        <p><strong>Director of publication:</strong> [Name]</p>
        <p><strong>Hosting provider:</strong> [Hosting company name, address, phone]</p>
        <p>This site is governed by French law. For any complaint, please contact us at the address above.</p>
      </div>
    </div>
  );
}

