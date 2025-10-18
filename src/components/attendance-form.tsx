import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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

const toastId = "attendance-toast";
const AttendanceForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      registrationNumber: "",
      attended: false,
    },
  });

  const { mutate: submitForm } = useMutation({
    mutationFn: async (data: FormSchema) => {
      await new Promise((res) => setTimeout(() => res(data), 3000));
    },
    onMutate: () => {
      toast.loading("Submitting your attendance...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Attendance recorded successfully!", { id: toastId });
    },
    onError: (error) => {
      toast.error("Something went wrong. Please try again.", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-2xl px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => submitForm(values))}>
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
                <Button type="submit" className="w-full">
                  Submit Attendance
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
