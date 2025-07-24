// Admin features exports
export { AdminAuthForm } from "./ui/AdminAuthForm";
export { AdminUsersTable } from "./ui/AdminUsersTable";
export { AdminInventoryTable } from "./ui/AdminInventoryTable";
export { AdminMappingsTable } from "./ui/AdminMappingsTable";
export { AdminLayout } from "./ui/AdminLayout";

// Hooks
export { useAdminAuth } from "./hooks/useAdminAuth";
export { useAdminUsers } from "./hooks/useAdminUsers";
export { useAdminInventory } from "./hooks/useAdminInventory";
export { useAdminMappings } from "./hooks/useAdminMappings";
export { useAdminInterests } from "./hooks/useAdminInterests";
export { useAdminSkills } from "./hooks/useAdminSkills";

// Types
export type {
  AdminUser,
  AdminInventoryItem,
  AdminMapping,
  AdminLoginRequest,
  AdminLoginResponse,
  UpdateInventoryRequest,
  AddMappingRequest,
  ChildWithBoxes,
  ToyBoxResponse,
  ToyBoxItemResponse,
  NextBoxResponse,
  NextBoxItemResponse,
} from "./types";

// Hook types
export type { Interest } from "./hooks/useAdminInterests";
export type { Skill } from "./hooks/useAdminSkills";
