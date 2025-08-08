export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Cookie Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <p>This page explains how cookies are used on the Wovely platform.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Cookies are used to improve your browsing experience and for analytics purposes.</li>
          <li>You can configure your browser to refuse cookies or to alert you when cookies are being sent.</li>
          <li>Some cookies are essential for the proper functioning of the site (authentication, cart, etc.).</li>
          <li>For more information or to manage your preferences, please refer to your browser settings or contact us.</li>
        </ul>
        <p>By continuing to browse this site, you accept the use of cookies in accordance with this policy.</p>
      </div>
    </div>
  );
}

