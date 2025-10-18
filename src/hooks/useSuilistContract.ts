import { useMutation } from '@tanstack/react-query';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG, FUNCTIONS } from '@/lib/constants';

interface AttendanceData {
  name: string;
  department: string;
  registrationNumber: string;
}

export const useRegisterAttendance = () => {
  const client = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (data: AttendanceData) => {
      if (!CONTRACT_CONFIG.REGISTRY_ID) {
        throw new Error('Registry ID not configured. Please set up the registry first.');
      }

      try {
        const tx = new Transaction();

        // Call the register_attendee function
        const target = `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::${FUNCTIONS.REGISTER_ATTENDEE}`;
        
        tx.moveCall({
          target,
          arguments: [
            tx.object(CONTRACT_CONFIG.REGISTRY_ID),
            tx.pure.string(data.name),
            tx.pure.string(data.department),
            tx.pure.string(data.registrationNumber),
          ],
        });

        console.log('Transaction target:', target);
        console.log('Registry ID:', CONTRACT_CONFIG.REGISTRY_ID);
        console.log('Data:', data);

        // Execute the transaction
        const result = await signAndExecuteTransaction({
          transaction: tx,
        });

        return result;
      } catch (error) {
        console.error('Transaction error:', error);
        throw error;
      }
    },
  });
};

// Hook to create a new registry (one-time setup)
export const useCreateRegistry = () => {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async () => {
      try {
        const tx = new Transaction();

        const target = `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::${FUNCTIONS.CREATE_REGISTRY}`;
        
        tx.moveCall({
          target,
          arguments: [],
        });

        console.log('Creating registry with target:', target);

        const result = await signAndExecuteTransaction({
          transaction: tx,
        });

        return result;
      } catch (error) {
        console.error('Create registry error:', error);
        throw error;
      }
    },
  });
};

// Hook to check if registry exists and get details
export const useRegistryInfo = () => {
  const client = useSuiClient();

  return useMutation({
    mutationFn: async () => {
      if (!CONTRACT_CONFIG.REGISTRY_ID) {
        throw new Error('No registry ID configured');
      }

      try {
        const registryObject = await client.getObject({
          id: CONTRACT_CONFIG.REGISTRY_ID,
          options: {
            showContent: true,
            showType: true,
          },
        });

        return registryObject;
      } catch (error) {
        console.error('Registry info error:', error);
        throw error;
      }
    },
  });
};