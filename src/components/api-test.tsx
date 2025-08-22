'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ApiTest() {
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const response = await apiClient.healthCheck();
      if (response.success) {
        setHealthStatus(`✅ Backend is running! ${response.data?.message}`);
      } else {
        setHealthStatus(`❌ Backend connection failed: ${response.error}`);
      }
    } catch (error) {
      setHealthStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔗 API Connection Test
          <Badge variant="outline">Backend</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testBackendConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </Button>
        
        {healthStatus && (
          <div className="p-3 rounded-md bg-muted">
            <p className="text-sm">{healthStatus}</p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>• Backend URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}</p>
          <p>• Frontend URL: {typeof window !== 'undefined' ? window.location.origin : 'Unknown'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
