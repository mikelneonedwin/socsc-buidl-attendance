import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useRegisterAttendance } from "@/hooks/useSuilistContract";

const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter your full name." }),
  department: z.string().min(1, { message: "Please enter your department." }),
  registrationNumber: z
    .string()
    .regex(/^\d{2}-[A-Za-z]{2}-[A-Za-z]{2}-\d{3,4}$/, {
      message: "Use a valid format like 24-IS-CS-0123.",
    })
    .transform((val) => {
      const parts = val.split("-");
      const number = +parts.pop()!;
      parts.push(number.toString().padStart(3, "0"));
      return parts.join("-");
    }),
  attended: z.literal<boolean>(true, {
    error: "Please confirm that you attended the BUIDL session.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const AttendanceForm = () => {
  const account = useCurrentAccount();
  const { mutate: registerAttendance, isPending } = useRegisterAttendance();
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      registrationNumber: "",
      attended: false,
    },
  });

  const onSubmit = (data: FormSchema) => {
    if (!account) {
      toast.error("Please connect your wallet first!");
      return;
    }

    const toastId = "attendance-toast";
    
    registerAttendance({
      name: data.name,
      department: data.department,
      registrationNumber: data.registrationNumber,
    }, {
      onMutate: () => {
        toast.loading("Recording your attendance on blockchain...", { id: toastId });
      },
      onSuccess: (result) => {
        console.log("Transaction successful:", result);
        toast.success("Attendance recorded successfully on blockchain!", { 
          id: toastId,
          description: `Transaction: ${result.digest}`,
        });
        form.reset();
      },
      onError: (error) => {
        console.error("Transaction failed:", error);
        toast.error("Failed to record attendance", {
          id: toastId,
          description: error.message || "Please try again.",
        });
      },
    });
  };

  if (!account) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-2xl px-6 text-center">
          <Card className="shadow-lg">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Connect Your Wallet
              </h3>
              <p className="text-muted-foreground">
                Please connect your Sui wallet to record your attendance on the blockchain.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-2xl px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow-lg">
              <CardContent>
                <h3 className="text-2xl font-bold text-center mb-8 text-primary">
                  BUIDL Session Attendance
                </h3>
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Ice Kid" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Information Systems"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 24-SC-CO-012" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attended"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={field.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label
                            htmlFor={field.name}
                            className="text-sm sm:text-base leading-snug"
                          >
                            I attended the BUIDL Session organized by SOCSC
                            Uniuyo.
                          </Label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isPending}
                >
                  {isPending ? "Recording..." : "Submit Attendance"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default AttendanceForm;
