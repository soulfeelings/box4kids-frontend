import React from "react";
import { ActionButton } from "./ActionButton";
import { useTranslation } from 'react-i18next';

interface ChildActionButtonsProps {
  onEditData: (childId: number) => void;
  onEditSubscription: (childId: number) => void;
  onDelete: (childId: number) => void;
  childId: number;
  isDisabled?: boolean;
}

export const ChildActionButtons: React.FC<ChildActionButtonsProps> = ({
  onEditData,
  onEditSubscription,
  onDelete,
  childId,
  isDisabled = false,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3 pt-4">
      <ActionButton
        onClick={() => onEditData(childId)}
        disabled={isDisabled}
        variant="secondary"
      >
        {t('edit_child_data')}
      </ActionButton>
      <ActionButton
        onClick={() => onEditSubscription(childId)}
        disabled={isDisabled}
        variant="secondary"
      >
        {t('edit_tariff')}
      </ActionButton>
      <ActionButton
        onClick={() => onDelete(childId)}
        disabled={isDisabled}
        variant="danger"
      >
        {t('delete')}
      </ActionButton>
    </div>
  );
};
