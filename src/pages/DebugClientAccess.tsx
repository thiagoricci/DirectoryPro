import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const DebugClientAccess = () => {
  const { user } = useAuth();
  const [testEmail, setTestEmail] = useState('');
  const [results, setResults] = useState<any>(null);
  const [clientAccessRecords, setClientAccessRecords] = useState<any[]>([]);

  const testClientAccess = async () => {
    if (!testEmail) return;
    
    try {
      const { data, error } = await supabase.rpc('verify_client_access', {
        client_email_input: testEmail.toLowerCase().trim()
      });

      setResults({ data, error });
    } catch (error) {
      setResults({ error });
    }
  };

  const fetchAllClientAccess = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('client_access')
        .select('*')
        .eq('realtor_id', user.id);

      setClientAccessRecords(data || []);
    } catch (error) {
      console.error('Error fetching client access records:', error);
    }
  };

  const addTestClient = async () => {
    if (!user || !testEmail) return;
    
    try {
      const { error } = await supabase
        .from('client_access')
        .insert({
          realtor_id: user.id,
          client_email: testEmail.toLowerCase().trim(),
        });

      if (error) {
        console.error('Error adding test client:', error);
      } else {
        console.log('Test client added successfully');
        fetchAllClientAccess();
      }
    } catch (error) {
      console.error('Error adding test client:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Debug Client Access</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Client Access Function</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Test Email</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={testClientAccess}>Test Access</Button>
              <Button onClick={addTestClient} variant="outline">Add Test Client</Button>
              <Button onClick={fetchAllClientAccess} variant="outline">Fetch All Records</Button>
            </div>
            
            {results && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Results:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Client Access Records</CardTitle>
          </CardHeader>
          <CardContent>
            {clientAccessRecords.length === 0 ? (
              <p className="text-muted-foreground">No client access records found.</p>
            ) : (
              <div className="space-y-2">
                {clientAccessRecords.map((record) => (
                  <div key={record.id} className="p-3 border rounded-lg">
                    <p><strong>Email:</strong> {record.client_email}</p>
                    <p><strong>Active:</strong> {record.is_active ? 'Yes' : 'No'}</p>
                    <p><strong>Created:</strong> {new Date(record.created_at).toLocaleString()}</p>
                    <p><strong>Expires:</strong> {record.expires_at ? new Date(record.expires_at).toLocaleString() : 'Never'}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current User Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm">
              {JSON.stringify({ 
                userId: user?.id, 
                email: user?.email 
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugClientAccess;