import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCreateRegistry } from "@/hooks/useSuilistContract";
import { toast } from "sonner";
import { CONTRACT_CONFIG } from "@/lib/constants";

const RegistrySetup = () => {
  const { mutate: createRegistry, isPending } = useCreateRegistry();

  const handleCreateRegistry = () => {
    createRegistry(undefined, {
      onSuccess: (result) => {
        const registryObject = result.objectChanges?.find(
          (change) => change.type === 'created' && change.objectType.includes('Registry')
        );
        
        if (registryObject && 'objectId' in registryObject) {
          toast.success(`Registry created! Object ID: ${registryObject.objectId}`, {
            description: "Copy this ID and add it to your constants.ts file as REGISTRY_ID",
            duration: 10000,
          });
          
          // Also log to console for easy copying
          console.log('Registry Object ID:', registryObject.objectId);
          console.log('Add this to your constants.ts file:');
          console.log(`REGISTRY_ID: '${registryObject.objectId}',`);
        }
      },
      onError: (error) => {
        toast.error("Failed to create registry", {
          description: error.message,
        });
      },
    });
  };

  if (CONTRACT_CONFIG.REGISTRY_ID) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Registry Already Configured</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            Registry ID: <code className="bg-green-100 px-2 py-1 rounded">{CONTRACT_CONFIG.REGISTRY_ID}</code>
          </p>
          <p className="text-sm text-green-600 mt-2">
            Your attendance system is ready to use!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">Setup Required</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-yellow-700">
          No registry found. Create a shared registry for attendance tracking. This only needs to be done once.
        </p>
        <Button onClick={handleCreateRegistry} disabled={isPending}>
          {isPending ? "Creating..." : "Create Registry"}
        </Button>
        <p className="text-sm text-yellow-600 mt-2">
          After creating, copy the Registry ID to your constants.ts file.
        </p>
      </CardContent>
    </Card>
  );
};

export default RegistrySetup;