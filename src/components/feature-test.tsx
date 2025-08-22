'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function FeatureTest() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const { user, login, register, logout } = useAuth();
  const { toast } = useToast();

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(testName);
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: result }));
      toast({
        title: `${testName} Test`,
        description: result.success ? '✅ Passed' : `❌ Failed: ${result.error}`,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }));
      toast({
        title: `${testName} Test`,
        description: `❌ Error: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const tests = [
    {
      name: 'Health Check',
      fn: () => apiClient.healthCheck(),
      description: 'Test backend connectivity'
    },
    {
      name: 'Login Test',
      fn: async () => {
        const result = await login({ email: 'test@example.com', password: 'password123' });
        return result;
      },
      description: 'Test user login functionality'
    },
    {
      name: 'Registration Test',
      fn: async () => {
        const testEmail = `test${Date.now()}@example.com`;
        const result = await register({
          name: 'Test User',
          email: testEmail,
          phone: '+8801712345678',
          password: 'password123',
          bloodGroup: 'O+',
          dateOfBirth: '1990-01-01',
          gender: 'other',
          address: {
            street: '123 Test Street',
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
          }
          // Location is now optional
        });
        return result;
      },
      description: 'Test user registration (location optional)'
    },
    {
      name: 'Get Donors',
      fn: () => apiClient.getDonors(),
      description: 'Test donor listing (public)'
    },
    {
      name: 'Get Blood Requests',
      fn: () => apiClient.getBloodRequests(),
      description: 'Test blood request listing (public)'
    },
    {
      name: 'Get Donor Stats',
      fn: () => apiClient.getDonorStats(),
      description: 'Test donor statistics (public)'
    },
    {
      name: 'Get Leaderboard',
      fn: () => apiClient.getDonorLeaderboard(),
      description: 'Test leaderboard functionality (public)'
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Feature Test Suite
          <Badge variant="outline">Comprehensive Testing</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium">Auth Status</p>
            <p className="text-xs text-muted-foreground">
              {user ? `Logged in as ${user.name}` : 'Not logged in'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Backend Status</p>
            <p className="text-xs text-muted-foreground">
              {testResults['Health Check']?.success ? '✅ Connected' : '❌ Disconnected'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Tests Run</p>
            <p className="text-xs text-muted-foreground">
              {Object.keys(testResults).length} / {tests.length}
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <Button
              key={test.name}
              onClick={() => runTest(test.name, test.fn)}
              disabled={loading === test.name}
              variant={testResults[test.name]?.success ? 'default' : 'outline'}
              className="justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="flex items-center gap-2">
                  {loading === test.name ? '⏳' : 
                   testResults[test.name]?.success ? '✅' : 
                   testResults[test.name] ? '❌' : '🔍'}
                  <span className="font-medium">{test.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {loading === test.name ? 'Running...' : test.description}
                </p>
              </div>
            </Button>
          ))}
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Test Results:</h3>
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{testName}</span>
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'PASS' : 'FAIL'}
                  </Badge>
                </div>
                {result.error && (
                  <p className="text-sm text-red-600">{result.error}</p>
                )}
                {result.success && result.data && (
                  <p className="text-sm text-green-600">
                    {typeof result.data === 'object' ? 'Data received successfully' : result.data}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => logout()}
            variant="outline"
            size="sm"
          >
            Logout
          </Button>
          <Button
            onClick={() => setTestResults({})}
            variant="outline"
            size="sm"
          >
            Clear Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
