export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Terms of Service (CGU)</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <p>These Terms of Service (CGU) govern the use of the Wovely platform. By using our services, you agree to comply with these terms.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access to the platform is reserved for registered users.</li>
          <li>Users must provide accurate and up-to-date information.</li>
          <li>Any abusive or fraudulent use may result in account suspension.</li>
          <li>Wovely reserves the right to modify these terms at any time.</li>
        </ul>
        <p>For any questions, please contact us via the contact page.</p>
      </div>
    </div>
  );
}

