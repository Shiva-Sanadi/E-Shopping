import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi";

const AddressCard = ({ address, onEdit, onDelete, onSetDefault, isDefault }) => {
  return (
    <div className={`border-2 rounded-lg p-4 ${isDefault ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex gap-2 items-center mb-2">
            <h3 className="font-semibold">{address.address}</h3>
            {isDefault && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                Default
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">
            {address.city}, {address.zip}
          </p>
          {address.phone && (
            <p className="text-gray-600 text-sm">{address.phone}</p>
          )}
        </div>

        <div className="flex gap-2">
          {!isDefault && (
            <button
              onClick={() => onSetDefault(address.id)}
              className="p-2 text-green-600 hover:bg-green-100 rounded transition"
              title="Set as default"
            >
              <FiCheck />
            </button>
          )}
          <button
            onClick={() => onEdit(address)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
            title="Edit"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
