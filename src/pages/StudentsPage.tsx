import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Users, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StudentsPage() {
  const { getAllStudents } = useAuth();
  const [students, setStudents] = useState(getAllStudents());

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = () => {
      setStudents(getAllStudents());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events within the same tab
    const interval = setInterval(() => {
      setStudents(getAllStudents());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [getAllStudents]);

  const paidCount = students.filter(s => s.feesPaid).length;
  const unpaidCount = students.length - paidCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Students</h1>
          <p className="text-muted-foreground">Overview of all registered students and their fee payment status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{students.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fees Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{paidCount}</div>
              <p className="text-xs text-muted-foreground">
                {students.length > 0 ? Math.round((paidCount / students.length) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{unpaidCount}</div>
              <p className="text-xs text-muted-foreground">
                {students.length > 0 ? Math.round((unpaidCount / students.length) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Student Directory</span>
            </CardTitle>
            <CardDescription>
              Real-time view of all students and their payment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Fee Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr 
                      key={student.id} 
                      className="border-b transition-smooth hover:bg-muted/50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-semibold text-sm">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-medium text-foreground">{student.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{student.email}</td>
                      <td className="py-4 px-4">
                        {student.feesPaid ? (
                          <Badge variant="secondary" className="bg-success/10 text-success border-success/20 flex items-center space-x-1 w-fit">
                            <CheckCircle className="h-3 w-3" />
                            <span>Paid</span>
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 flex items-center space-x-1 w-fit">
                            <XCircle className="h-3 w-3" />
                            <span>Pending</span>
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {students.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No students registered yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}