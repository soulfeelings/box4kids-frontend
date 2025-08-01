import { UserData } from "../types";

export const DeliveryAddressCards = ({
  user,
  selectedAddressId,
  onAddressSelect,
  onAddNewAddress,
  onEditAddress,
  isCreatingNew,
}: {
  user: UserData;
  selectedAddressId: number | null;
  onAddressSelect: (id: number) => void;
  onAddNewAddress: () => void;
  onEditAddress?: (id: number) => void;
  isCreatingNew: boolean;
}) => {
  const formatTimeRange = (time: string) => {
    if (!time) return "";

    // Если время в формате "9-12", преобразуем в "9:00 - 12:00"
    if (time.includes("-")) {
      const [start, end] = time.split("-");
      return `${start}:00 - ${end}:00`;
    }

    return time;
  };

  const formatDate = (date: string) => {
    if (!date) return "";

    // Если дата в формате "DD.MM", добавляем название месяца
    if (date.includes(".")) {
      const [day, month] = date.split(".");
      const monthNames = [
        "янв",
        "фев",
        "мар",
        "апр",
        "мая",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ];

      const monthIndex = parseInt(month) - 1;
      const monthName = monthNames[monthIndex] || month;

      return `${day} ${monthName}`;
    }

    return date;
  };

  return (
    <>
      {user?.deliveryAddresses && user.deliveryAddresses.length > 0 && (
        <div className="space-y-3 mb-6">
          <div>
            <h3
              className="text-lg font-medium text-gray-900 mb-4 px-3"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Сохраненные места доставки
            </h3>

            {user.deliveryAddresses.map((address, index) => (
              <div
                key={address.id}
                onClick={() => onAddressSelect(address.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all text-left mb-3 cursor-pointer ${
                  selectedAddressId === address.id
                    ? "border-[#7782F5] bg-[#7782F5]/5"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="text-purple-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p
                        className="font-medium text-gray-900"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        {address.name}
                      </p>
                      <p
                        className="text-sm text-gray-500 mb-1"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        {address.address}
                      </p>
                      <p
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        {formatDate(address.date)} •{" "}
                        {formatTimeRange(address.time)}
                      </p>
                      {address.comment && (
                        <p
                          className="text-xs text-gray-400 mt-1"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {address.comment}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedAddressId === address.id && (
                      <div className="w-5 h-5 rounded-full bg-[#7782F5] flex items-center justify-center">
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {onEditAddress && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAddress(address.id);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          className="text-gray-500"
                        >
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Address Button */}
          <button
            onClick={onAddNewAddress}
            className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all text-left ${
              isCreatingNew
                ? "border-[#7782F5] bg-[#7782F5]/5"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <p
                className="font-medium text-gray-700"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Добавить новый адрес
              </p>
            </div>
          </button>
        </div>
      )}
    </>
  );
};
