import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, ShoppingBag, Truck, UserPlus } from "lucide-react";

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-teal-600 text-white py-16">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <HelpCircle className="mx-auto h-16 w-16 mb-4 text-teal-200" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Questions Fréquentes
                    </h1>
                    <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                        Trouvez rapidement les réponses à vos questions sur Wovely
                    </p>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="container mx-auto max-w-4xl py-16 px-4">
                <div className="grid gap-8 md:grid-cols-2 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <MessageCircle className="h-8 w-8 text-teal-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Besoin d'aide ?</h3>
                        <p className="text-gray-600">Notre équipe support est là pour vous accompagner</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <Truck className="h-8 w-8 text-teal-600 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Livraison rapide</h3>
                        <p className="text-gray-600">Suivez vos commandes en temps réel</p>
                    </div>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="q1" className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
                        <AccordionTrigger className="hover:text-teal-600 transition-colors py-6">
                            <div className="flex items-center gap-3">
                                <UserPlus className="h-5 w-5 text-teal-600" />
                                <span className="text-left font-medium">Comment créer un compte ?</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
                            Cliquez sur "S'inscrire" dans la navigation ou le footer, remplissez les informations requises et soumettez le formulaire.
                            Vous recevrez un email de confirmation pour activer votre compte.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="q2" className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
                        <AccordionTrigger className="hover:text-teal-600 transition-colors py-6">
                            <div className="flex items-center gap-3">
                                <MessageCircle className="h-5 w-5 text-teal-600" />
                                <span className="text-left font-medium">Comment contacter le support ?</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
                            Utilisez le formulaire de contact disponible sur la page "Contact". Notre équipe vous répondra dans les plus brefs délais.
                            Vous pouvez aussi nous écrire directement à support@wovely.com
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="q3" className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
                        <AccordionTrigger className="hover:text-teal-600 transition-colors py-6">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-5 w-5 text-teal-600" />
                                <span className="text-left font-medium">Comment passer une commande ?</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
                            Parcourez les produits, ajoutez les articles désirés à votre panier, puis suivez le processus de commande pour finaliser votre achat.
                            Le paiement est sécurisé et vous recevrez une confirmation par email.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="q4" className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
                        <AccordionTrigger className="hover:text-teal-600 transition-colors py-6">
                            <div className="flex items-center gap-3">
                                <Truck className="h-5 w-5 text-teal-600" />
                                <span className="text-left font-medium">Puis-je suivre ma commande ?</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
                            Oui, vous pouvez suivre le statut de votre commande depuis votre tableau de bord dans la section "Mes commandes".
                            Vous recevrez également des notifications par email à chaque étape.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="q5" className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
                        <AccordionTrigger className="hover:text-teal-600 transition-colors py-6">
                            <div className="flex items-center gap-3">
                                <UserPlus className="h-5 w-5 text-teal-600" />
                                <span className="text-left font-medium">Comment devenir vendeur ?</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
                            Cliquez sur "S'inscrire" et sélectionnez l'option vendeur. Remplissez les informations commerciales requises pour postuler en tant que vendeur.
                            Notre équipe examinera votre demande sous 48h.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* CTA Section */}
                <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h3>
                    <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
                        Notre équipe support est disponible pour répondre à toutes vos questions personnalisées
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        <MessageCircle className="h-5 w-5" />
                        Nous contacter
                    </a>
                </div>
            </div>
        </div>
    );
}
