import { useDeleteChildChildrenChildIdDelete } from "../api-client";
import { useStore } from "../store/store";
import { notifications } from "../utils/notifications";
import { useTranslation } from 'react-i18next';

export const useHandleDeleteChilld = () => {
  const { removeChild } = useStore();
  const { t } = useTranslation();

  const useDeleteChild = useDeleteChildChildrenChildIdDelete();

  const handleDeleteChild = async (childId: number) => {
    const child =
      useStore.getState().user?.children.find((c) => c.id === childId) || null;
    if (child && window.confirm(t('delete_child_confirm', { name: child.name }))) {
      try {
        await useDeleteChild.mutateAsync({
          childId: childId,
        });
        removeChild(childId);
        notifications.success(t('child_removed'));
      } catch (error) {
        notifications.error(t('failed_to_delete_child'));
      }
    }
  };

  return { handleDeleteChild };
};
