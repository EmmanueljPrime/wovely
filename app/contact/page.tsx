import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-lg py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Contact us</h1>
      <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <Input id="name" name="name" type="text" placeholder="Your name" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input id="email" name="email" type="email" placeholder="you@email.com" required />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <Textarea id="message" name="message" placeholder="Your message..." rows={5} required />
        </div>
        <Button type="submit" className="w-full bg-black hover:bg-gray-800">
          Send
        </Button>
      </form>
    </div>
  );
}

