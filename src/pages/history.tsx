import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Navigate } from "react-router";
import { toast } from "sonner";

type Submission = {
  id: string;
  name: string;
  department: string;
  registrationNumber: string;
  attended: boolean;
  createdAt: string;
};

const fetchSubmissions = async (): Promise<Submission[]> => {
  // Replace with your actual API or Firestore call
  await new Promise((res) => setTimeout(res, 1500));
  return [
    {
      id: "1",
      name: "Ice Kid",
      department: "Information Systems",
      registrationNumber: "24-IS-CS-0123",
      attended: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Precious John",
      department: "Computer Science",
      registrationNumber: "23-CS-CO-0051",
      attended: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
};

const History = () => {
  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });
  if (isError) {
    toast.error("Unable to fetch submissions. Please try again.", {
      description: error.message,
    });
  }
  const account = useCurrentAccount();

  if (!account) return <Navigate to="/" replace />;

  return (
    <section className="py-20 bg-[#F9FBFC]">
      <div className="container mx-auto max-w-5xl px-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                Submission History
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Review your past attendance records and verify your submissions.
              </p>
            </div>
            <Button onClick={() => refetch()} variant="secondary">
              Refresh
            </Button>
          </CardHeader>

          <Separator />

          <CardContent className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <Skeleton className="h-4 w-[30%]" />
                    <Skeleton className="h-4 w-[20%]" />
                    <Skeleton className="h-4 w-[25%]" />
                    <Skeleton className="h-4 w-[15%]" />
                  </div>
                ))}
              </div>
            ) : data && data.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Reg. Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {submission.name}
                        </TableCell>
                        <TableCell>{submission.department}</TableCell>
                        <TableCell>{submission.registrationNumber}</TableCell>
                        <TableCell>
                          {submission.attended ? (
                            <Badge>Present</Badge>
                          ) : (
                            <Badge variant="secondary">Absent</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(submission.createdAt), "PPp")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  No attendance submissions yet.
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default History;
