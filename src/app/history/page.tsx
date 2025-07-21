
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/context/language-context';
import { Icons } from '@/components/icons';

const donationHistory = [
  { id: 'd1', date: '2024-05-15', recipientName: 'Amina Khatun', location: 'Square Hospital, Dhaka', quantity: 1, status: 'Completed' },
  { id: 'd2', date: '2023-11-20', recipientName: 'Rahim Sheikh', location: 'Dhaka Medical College', quantity: 1, status: 'Completed' },
  { id: 'd3', date: '2023-04-01', recipientName: 'Farida Yesmin', location: 'United Hospital, Dhaka', quantity: 1, status: 'Completed' },
];

const receiptHistory = [
  { id: 'r1', date: '2024-06-10', donorName: 'Dip Kundu', location: 'Dhanmondi, Dhaka', quantity: 1, status: 'Fulfilled' },
  { id: 'r2', date: '2022-08-25', donorName: 'Nadia Chowdhury', location: 'Banani, Dhaka', quantity: 2, status: 'Fulfilled' },
];

export default function HistoryPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold font-headline mb-2">{t('history.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('history.description')}</p>
      
      <Card>
        <CardHeader>
            <CardTitle>{t('history.cardTitle')}</CardTitle>
            <CardDescription>{t('history.activityMessage')}</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="donations" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="donations">Donations Made</TabsTrigger>
                <TabsTrigger value="received">Blood Received</TabsTrigger>
              </TabsList>
              <TabsContent value="donations" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Donations</CardTitle>
                    <CardDescription>A record of the lives you've touched.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {donationHistory.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Quantity (Units)</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {donationHistory.map((donation) => (
                            <TableRow key={donation.id}>
                              <TableCell className="font-medium">{donation.date}</TableCell>
                              <TableCell>{donation.recipientName}</TableCell>
                              <TableCell>{donation.location}</TableCell>
                              <TableCell className="text-right">{donation.quantity}</TableCell>
                              <TableCell className="text-center">
                                <Badge>{donation.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-16 text-muted-foreground flex flex-col items-center justify-center">
                        <Icons.history className="w-12 h-12 mx-auto mb-4" />
                        <p>You haven't made any donations yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="received" className="mt-4">
                <Card>
                   <CardHeader>
                    <CardTitle>Your Received Donations</CardTitle>
                    <CardDescription>A record of the help you've received from generous donors.</CardDescription>
                  </CardHeader>
                   <CardContent>
                    {receiptHistory.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Donor</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Quantity (Units)</TableHead>
                             <TableHead className="text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {receiptHistory.map((receipt) => (
                            <TableRow key={receipt.id}>
                              <TableCell className="font-medium">{receipt.date}</TableCell>
                              <TableCell>{receipt.donorName}</TableCell>
                              <TableCell>{receipt.location}</TableCell>
                              <TableCell className="text-right">{receipt.quantity}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary">{receipt.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                       <div className="text-center py-16 text-muted-foreground flex flex-col items-center justify-center">
                        <Icons.history className="w-12 h-12 mx-auto mb-4" />
                        <p>You haven't received any blood donations through the app.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
