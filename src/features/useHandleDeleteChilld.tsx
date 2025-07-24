import { useDeleteChildChildrenChildIdDelete } from "../api-client";
import { useStore } from "../store/store";
import { notifications } from "../utils/notifications";

export const useHandleDeleteChilld = () => {
  const { removeChild } = useStore();

  const useDeleteChild = useDeleteChildChildrenChildIdDelete();

  const handleDeleteChild = async (childId: number) => {
    const child =
      useStore.getState().user?.children.find((c) => c.id === childId) || null;
    if (child && window.confirm(`Удалить данные ребёнка ${child.name}?`)) {
      try {
        await useDeleteChild.mutateAsync({
          childId: childId,
        });
        removeChild(childId);
        notifications.childRemoved();
      } catch (error) {
        notifications.error("Не удалось удалить ребенка");
      }
    }
  };

  return { handleDeleteChild };
};
