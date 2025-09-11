import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AppRole } from '@/hooks/useRoles';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const RoleManagement = () => {
  const [userEmail, setUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);

  const roles: { value: AppRole; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'user', label: 'User' },
    { value: 'tour_operator', label: 'Tour Operator' },
    { value: 'language_teacher', label: 'Language Teacher' },
    { value: 'cultural_guide', label: 'Cultural Guide' },
  ];

  const loadUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error loading user roles:', error);
      toast.error('Failed to load user roles');
    }
  };

  useEffect(() => {
    loadUserRoles();
  }, []);

  const assignRole = async () => {
    if (!userEmail || !selectedRole) {
      toast.error('Please enter an email and select a role');
      return;
    }

    setLoading(true);
    try {
      // First, find the user by email from profiles table
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, email')
        .eq('email', userEmail)
        .single();
      
      if (profileError || !profiles) {
        toast.error('User not found with that email');
        return;
      }

      // Insert the role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: profiles.user_id,
          role: selectedRole
        });

      if (roleError) {
        if (roleError.code === '23505') { // Unique constraint violation
          toast.error('User already has this role assigned');
        } else {
          throw roleError;
        }
      } else {
        toast.success(`Successfully assigned ${selectedRole} role to ${userEmail}`);
        setUserEmail('');
        setSelectedRole('user');
        loadUserRoles();
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role. Make sure you have admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign User Role</CardTitle>
          <CardDescription>
            Assign roles to users in the system. Users must be registered first.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="user-email">User Email</Label>
            <Input
              id="user-email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="role-select">Role</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={assignRole} disabled={loading}>
            {loading ? 'Assigning...' : 'Assign Role'}
          </Button>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>Important:</strong> To assign yourself admin privileges, you need to manually insert a role into the database.
          Use the SQL Editor: <code>INSERT INTO user_roles (user_id, role) VALUES ('your-user-id', 'admin');</code>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Current User Roles</CardTitle>
          <CardDescription>
            Overview of all user role assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userRoles.length === 0 ? (
            <p className="text-muted-foreground">No roles assigned yet.</p>
          ) : (
            <div className="space-y-2">
              {userRoles.map((userRole) => (
                <div key={userRole.id} className="flex justify-between items-center p-2 border rounded">
                  <span className="font-mono text-sm">{userRole.user_id}</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                    {userRole.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};