import { FiX, FiCopy } from "react-icons/fi";
import { useState } from "react";

const CouponCard = ({ coupon, onCopy, onDelete, showDelete = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = new Date(coupon.expiryDate) < new Date();
  const isActive = coupon.isActive && !isExpired;

  return (
    <div className={`border rounded-lg p-4 ${isActive ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-gray-600 text-xs uppercase font-semibold">Coupon Code</p>
          <p className="text-lg font-bold text-blue-600">{coupon.code}</p>
        </div>
        {showDelete && (
          <button
            onClick={() => onDelete && onDelete(coupon.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
            title="Delete"
          >
            <FiX />
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm font-semibold">{coupon.description}</p>
        <p className="text-xs text-gray-600">
          {coupon.discountType === "PERCENTAGE"
            ? `${coupon.discountValue}% Off`
            : `$${coupon.discountValue} Off`}
          {coupon.minOrderValue > 0 && ` on orders over $${coupon.minOrderValue}`}
        </p>
        <p className="text-xs text-gray-500">
          Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-semibold transition ${
            copied
              ? "bg-green-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <FiCopy size={16} />
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
    </div>
  );
};

export default CouponCard;
