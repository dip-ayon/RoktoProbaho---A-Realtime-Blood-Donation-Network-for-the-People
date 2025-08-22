'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';

export default function DebugButtons() {
  const [testStatus, setTestStatus] = useState<string>('');
  const { user, loading, login, logout } = useAuth();
  const { t, isLoaded, language } = useLanguage();

  const testButton = () => {
    setTestStatus('Button clicked successfully!');
    setTimeout(() => setTestStatus(''), 3000);
  };

  const testAuth = () => {
    setTestStatus(`Auth Status: User=${!!user}, Loading=${loading}`);
    setTimeout(() => setTestStatus(''), 3000);
  };

  const testLanguage = () => {
    setTestStatus(`Language: ${language}, Loaded: ${isLoaded}, Test: ${t('nav.home')}`);
    setTimeout(() => setTestStatus(''), 3000);
  };

  return (
    <Card className="w-full max-w-lg mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Debug Buttons
          <span className="text-sm text-muted-foreground">Testing Button Functionality</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button onClick={testButton} variant="default">
            Test Basic Button
          </Button>
          
          <Button onClick={testAuth} variant="secondary">
            Test Auth Context
          </Button>
          
          <Button onClick={testLanguage} variant="outline">
            Test Language Context
          </Button>
          
          <Button 
            onClick={() => setTestStatus('Loading test...')} 
            disabled={true}
            variant="ghost"
          >
            Test Disabled Button
          </Button>
        </div>
        
        {testStatus && (
          <div className="p-3 rounded-md bg-muted border">
            <p className="text-sm font-mono">{testStatus}</p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Auth: {user ? 'Logged In' : 'Not Logged In'} (Loading: {loading ? 'Yes' : 'No'})</p>
          <p>• Language: {language} (Loaded: {isLoaded ? 'Yes' : 'No'})</p>
          <p>• Translation Test: "{t('nav.home')}"</p>
        </div>
      </CardContent>
    </Card>
  );
}
