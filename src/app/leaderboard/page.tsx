
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { useLanguage } from '@/context/language-context';

interface TopDonor {
  rank: number;
  name: string;
  avatarUrl: string;
  dataAiHint: string;
  donations: number;
  badges: string[];
}

const topDonors: TopDonor[] = [
  { rank: 1, name: 'Dip Kundu', avatarUrl: 'https://placehold.co/128x128.png', dataAiHint: 'man portrait', donations: 25, badges: ['Hero Donor', '5+ Donations'] },
  { rank: 2, name: 'Anika Tabassum', avatarUrl: 'https://placehold.co/128x128.png', dataAiHint: 'woman portrait', donations: 22, badges: ['Life Saver', '5+ Donations'] },
  { rank: 3, name: 'Raihan Chowdhury', avatarUrl: 'https://placehold.co/128x128.png', dataAiHint: 'man portrait', donations: 18, badges: ['Community Pillar', '5+ Donations'] },
  { rank: 4, name: 'Nadia Chowdhury', avatarUrl: 'https://placehold.co/128x128.png', dataAiHint: 'woman portrait', donations: 15, badges: ['5+ Donations'] },
  { rank: 5, name: 'Saleh Ahmed', avatarUrl: 'https://placehold.co/128x128.png', dataAiHint: 'man portrait', donations: 12, badges: ['5+ Donations'] },
  { rank: 6, name: 'Karim Rahman', avatarUrl: 'https://placehold.co/128x128.png', dataAiHint: 'man portrait', donations: 10, badges: ['5+ Donations'] },
  { rank: 7, name: 'Imran Khan', avatarUrl: 'https://placehold.co/128x128.png', dataAiHint: 'man portrait', donations: 8, badges: ['5+ Donations'] },
];

export default function LeaderboardPage() {
  const { t } = useLanguage();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Icons.leaderboard className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Icons.leaderboard className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Icons.leaderboard className="w-6 h-6 text-orange-400" />;
    return <span className="font-bold text-lg">{rank}</span>;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold font-headline mb-2">{t('leaderboard.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('leaderboard.description')}</p>
      
       <Card>
        <CardHeader>
            <CardTitle>{t('leaderboard.cardTitle')}</CardTitle>
            <CardDescription>Here are our top life-savers, ranked by total donations.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-20 text-center">Rank</TableHead>
                        <TableHead>Donor</TableHead>
                        <TableHead className="text-center">Donations</TableHead>
                        <TableHead>Badges</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topDonors.map((donor) => (
                        <TableRow key={donor.rank}>
                            <TableCell className="text-center">
                                {getRankIcon(donor.rank)}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={donor.avatarUrl} data-ai-hint={donor.dataAiHint} />
                                        <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{donor.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-bold text-lg">{donor.donations}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-2">
                                    {donor.badges.map(badge => (
                                        <Badge key={badge} variant="secondary">
                                            <Icons.award className="mr-1 h-4 w-4" />
                                            {badge}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
