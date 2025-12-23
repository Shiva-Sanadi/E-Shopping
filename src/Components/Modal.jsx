const Modal = ({ isModalOpen, setIsModalOpen, children }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 text-3xl"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
