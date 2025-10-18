export const CONTRACT_CONFIG = {
  PACKAGE_ID: '0xcd9689647c1b99166a80fe9a5bf868dcd970388f68c48abe6457c3faf68b2060',
  MODULE_NAME: 'suilist',
  // Registry object ID from your deployment
  REGISTRY_ID: '0xbcceaceb299c8270e5a2aa9b36f44cac076412c4f2163ca827879ff4ae8d7bdb',
} as const;

export const FUNCTIONS = {
  REGISTER_ATTENDEE: 'register_attendee',
  CREATE_REGISTRY: 'create_and_share_registry',
} as const;