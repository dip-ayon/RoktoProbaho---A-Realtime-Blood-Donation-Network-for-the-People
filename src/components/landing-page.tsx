'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useLanguage } from '@/context/language-context';

const liveRequests = [
  { bloodType: 'O+', location: 'Dhaka', time: '2m ago' },
  { bloodType: 'A-', location: 'Chittagong', time: '5m ago' },
  { bloodType: 'B+', location: 'Sylhet', time: '10m ago' },
  { bloodType: 'AB+', location: 'Rajshahi', time: '12m ago' },
];

export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Icons.add className="w-8 h-8 text-primary" />,
      title: t('home.howItWorks.feature1Title'),
      description: t('home.howItWorks.feature1Desc'),
    },
    {
      icon: <Icons.user className="w-8 h-8 text-primary" />,
      title: t('home.howItWorks.feature2Title'),
      description: t('home.howItWorks.feature2Desc'),
    },
    {
      icon: <Icons.phone className="w-8 h-8 text-primary" />,
      title: t('home.howItWorks.feature3Title'),
      description: t('home.howItWorks.feature3Desc'),
    },
    {
      icon: <Icons.logo className="w-8 h-8 text-primary" />,
      title: t('home.howItWorks.feature4Title'),
      description: t('home.howItWorks.feature4Desc'),
    },
  ];
  
  const testimonials = [
    {
      name: t('home.stories.testimonial1Name'),
      role: t('home.stories.testimonial1Role'),
      avatar: 'https://placehold.co/128x128.png',
      dataAiHint: 'woman portrait',
      text: t('home.stories.testimonial1Text'),
    },
    {
      name: t('home.stories.testimonial2Name'),
      role: t('home.stories.testimonial2Role'),
      avatar: 'https://placehold.co/128x128.png',
      dataAiHint: 'man portrait',
      text: t('home.stories.testimonial2Text'),
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary tracking-tighter">
                    {t('home.hero.title')}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground">
                    {t('home.hero.subtitle')}
                </p>
                <div className="mt-8 flex justify-center md:justify-start gap-4">
                    <Button asChild size="lg" className="font-bold">
                    <Link href="/login">{t('home.hero.requestButton')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="font-bold">
                    <Link href="/signup">{t('home.hero.donateButton')}</Link>
                    </Button>
                </div>
            </div>
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
                <Image src="happydonor.jpeg" alt="Happy blood donors and recipients" layout="fill" objectFit="cover" data-ai-hint="blood donation community" />
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('home.howItWorks.title')}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{t('home.howItWorks.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                 <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('home.impact.title')}</h2>
                 <p className="mt-2 text-lg text-muted-foreground">{t('home.impact.subtitle')}</p>
                 <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                    <div className="p-6 rounded-lg bg-background">
                       <p className="text-4xl font-bold text-primary">10,452+</p>
                       <p className="text-muted-foreground mt-1">{t('home.impact.livesSaved')}</p>
                    </div>
                     <div className="p-6 rounded-lg bg-background">
                       <p className="text-4xl font-bold text-primary">5,000+</p>
                       <p className="text-muted-foreground mt-1">{t('home.impact.registeredDonors')}</p>
                    </div>
                 </div>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('home.impact.happeningNow')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {liveRequests.map((req, i) => (
                        <li key={i} className="flex items-center justify-between p-3 rounded-md bg-background">
                           <div className="flex items-center gap-3">
                              <Icons.blood className="w-6 h-6 text-primary" />
                              <div>
                                <p className="font-semibold">{t('home.impact.needs')} <Badge variant="destructive">{req.bloodType}</Badge></p>
                                <p className="text-sm text-muted-foreground">{t('home.impact.in')} {req.location}</p>
                              </div>
                           </div>
                           <p className="text-sm text-muted-foreground">{req.time}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
           </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('home.stories.title')}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{t('home.stories.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <blockquote className="mt-4 pl-6 border-l-2 border-primary italic text-muted-foreground">
                    {testimonial.text}
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('home.cta.title')}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
                {t('home.cta.subtitle')}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold">
                 <Link href="/signup">{t('home.cta.joinButton')}</Link>
              </Button>
            </div>
         </div>
      </section>

    </div>
  );
}
