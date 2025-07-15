import React from "react";
import { ActionButton } from "./ActionButton";

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
  return (
    <div className="space-y-3 pt-4">
      <ActionButton
        onClick={() => onEditData(childId)}
        disabled={isDisabled}
        variant="secondary"
      >
        Изменить данные ребёнка
      </ActionButton>

      <ActionButton
        onClick={() => onEditSubscription(childId)}
        disabled={isDisabled}
        variant="secondary"
      >
        Изменить тариф
      </ActionButton>

      <ActionButton
        onClick={() => onDelete(childId)}
        disabled={isDisabled}
        variant="danger"
      >
        Удалить
      </ActionButton>
    </div>
  );
};
