import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Cancel = ({ showCancelDialog, setShowCancelDialog }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmationCancelMessage, setConfirmationCancelMessage] = useState("");
  const navigate = useNavigate();

  const handleCancellation = async () => {
    try {
      setIsCancelling(true);
      setConfirmationCancelMessage("❌ Cancelling...");

      await axios.post("http://localhost:4000/block/cancel");

      setConfirmationCancelMessage("✅ Cancellation successful.");
    } catch (error) {
      console.error("Cancel API failed:", error);
      setConfirmationCancelMessage("❌ Failed to cancel.");
    } finally {
      setTimeout(() => {
        setShowCancelDialog(false);
        setIsCancelling(false);
        navigate("/validate");
      }, 1500);
    }
  };
  

  return (
    <AnimatePresence>
      {showCancelDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.7 }}
            animate={{ scale: 1.1 }}
            exit={{ scale: 0.7 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
            className="bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-6 w-[90%] max-w-md text-center text-black"
          >
            <h3 className="text-xl font-semibold mb-4 text-red-800">
              Are you sure you want to cancel?
            </h3>

            <div className="flex justify-center gap-6 mb-4">
              <button
                onClick={handleCancellation}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow flex items-center justify-center min-w-[80px]"
              >
                {isCancelling ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>
                ) : (
                  "Yes"
                )}
              </button>
              <button
                onClick={() => {
                  setConfirmationCancelMessage("🕗 Resuming process...");
                  setTimeout(() => {
                    setShowCancelDialog(false);
                    setConfirmationCancelMessage("");
                  }, 1500);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow"
              >
                No
              </button>
            </div>

            {confirmationCancelMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-900"
              >
                {confirmationCancelMessage}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cancel;
