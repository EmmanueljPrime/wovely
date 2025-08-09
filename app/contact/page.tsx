import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone, Clock, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-teal-600 text-white py-16">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <MessageSquare className="mx-auto h-16 w-16 mb-4 text-teal-200" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Contactez-nous
                    </h1>
                    <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                        Notre équipe est là pour répondre à toutes vos questions
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl py-16 px-4">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
                            <p className="text-gray-600">Nous vous répondrons dans les plus brefs délais</p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Prénom
                                    </label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="Votre prénom"
                                        className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom
                                    </label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Votre nom"
                                        className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Sujet
                                </label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="L'objet de votre message"
                                    className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Décrivez votre demande en détail..."
                                    rows={6}
                                    className="rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Send className="h-5 w-5" />
                                Envoyer le message
                            </Button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Informations de contact</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-teal-100 p-3 rounded-lg">
                                        <Mail className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                                        <p className="text-gray-600">support@wovely.com</p>
                                        <p className="text-sm text-gray-500">Pour toute demande de support</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-teal-100 p-3 rounded-lg">
                                        <Phone className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Téléphone</h4>
                                        <p className="text-gray-600">+33 1 23 45 67 89</p>
                                        <p className="text-sm text-gray-500">Lun-Ven de 9h à 18h</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-teal-100 p-3 rounded-lg">
                                        <MapPin className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Adresse</h4>
                                        <p className="text-gray-600">123 Rue de la Mode</p>
                                        <p className="text-gray-600">75001 Paris, France</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-teal-100 p-3 rounded-lg">
                                        <Clock className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Horaires de support</h4>
                                        <p className="text-gray-600">Lundi - Vendredi : 9h - 18h</p>
                                        <p className="text-gray-600">Week-end : 10h - 16h</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Link */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white text-center">
                            <h3 className="text-xl font-bold mb-3">Besoin d'une réponse rapide ?</h3>
                            <p className="text-teal-100 mb-6">
                                Consultez notre FAQ pour trouver des réponses aux questions les plus fréquentes
                            </p>
                            <a
                                href="/public/faq"
                                className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                <MessageSquare className="h-5 w-5" />
                                Voir la FAQ
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
