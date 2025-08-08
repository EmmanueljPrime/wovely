export default function CGVPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Terms and Conditions of Sale (CGV)</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <p>These Terms and Conditions of Sale (CGV) apply to all purchases made on the Wovely platform.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>All prices are indicated in euros and include VAT unless otherwise stated.</li>
          <li>Orders are confirmed after payment is received.</li>
          <li>Products are delivered to the address provided by the customer.</li>
          <li>Customers have a right of withdrawal in accordance with applicable law.</li>
          <li>For any dispute, French law applies.</li>
        </ul>
        <p>For more information, please contact our support team.</p>
      </div>
    </div>
  );
}

