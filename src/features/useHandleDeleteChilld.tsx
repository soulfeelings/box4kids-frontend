import { useDeleteChildChildrenChildIdDelete } from "../api-client";
import { useStore } from "../store/store";
import { notifications } from "../utils/notifications";

export const useHandleDeleteChilld = () => {
  const { user, removeChild, getChildById } = useStore();

  const useDeleteChild = useDeleteChildChildrenChildIdDelete();

  const handleDeleteChild = async (childId: number) => {
    const child = getChildById(childId);
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
