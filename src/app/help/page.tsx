'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';

export default function HelpPage() {
  const { t } = useLanguage();
  const faqs = [
    {
        question: t('help.q1'),
        answer: t('help.a1')
    },
    {
        question: t('help.q2'),
        answer: t('help.a2')
    },
    {
        question: t('help.q3'),
        answer: t('help.a3')
    },
    {
        question: t('help.q4'),
        answer: t('help.a4')
    }
]
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold font-headline mb-2">{t('help.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('help.description')}</p>
      
       <Card>
        <CardHeader>
            <CardTitle>{t('help.cardTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
