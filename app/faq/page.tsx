import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="bg-white p-6 rounded-lg shadow-md">
        <AccordionItem value="q1">
          <AccordionTrigger>How do I create an account?</AccordionTrigger>
          <AccordionContent>
            Click on "Register" in the navigation or footer, fill in the required information, and submit the form. You will receive a confirmation email.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>How can I contact support?</AccordionTrigger>
          <AccordionContent>
            You can use the contact form available on the "Contact" page. Our team will respond as soon as possible.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>How do I place an order?</AccordionTrigger>
          <AccordionContent>
            Browse the products, add the desired items to your cart, and follow the checkout process to complete your order.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q4">
          <AccordionTrigger>Can I track my order?</AccordionTrigger>
          <AccordionContent>
            Yes, you can track your order status from your account dashboard under the "Orders" section.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q5">
          <AccordionTrigger>How do I become a seller?</AccordionTrigger>
          <AccordionContent>
            Click on "Register" and select the seller option. Fill in the required business information to apply as a seller.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

