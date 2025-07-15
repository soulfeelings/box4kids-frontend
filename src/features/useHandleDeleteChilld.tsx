import { useDeleteChildChildrenChildIdDelete } from "../api-client";
import { useStore } from "../store/store";

export const useHandleDeleteChilld = () => {
  const { user, removeChild } = useStore();

  const useDeleteChild = useDeleteChildChildrenChildIdDelete();

  const handleDeleteChild = async (childId: number) => {
    const child = user?.children.find((c) => c.id === childId);
    if (child && window.confirm(`Удалить данные ребёнка ${child.name}?`)) {
      await useDeleteChild.mutateAsync({
        childId: childId,
      });
      removeChild(childId);
    }
  };

  return { handleDeleteChild };
};
