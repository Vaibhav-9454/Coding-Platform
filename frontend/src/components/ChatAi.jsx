import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";

const ChatAi = ({ problem }) => {
  const [messages, setMessages] = useState([
    { role: "model", parts: [{ text: "Hi, how can I help you?" }] },
  ]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const messagesEndRef = useRef(null);

  // ✅ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ Submit handler
  const onSubmit = async (data) => {
    const userMessage = {
      role: "user",
      parts: [{ text: data.message }],
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    reset();
    setLoading(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title: problem?.title,
        description: problem?.description,
        testCases: problem?.visibleTestCases,
        startCode: problem?.startCode,
      });

      const aiMessage = {
        role: "model",
        parts: [{ text: response.data.message }],
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "❌ Error from AI chatbot" }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">

      <h2 className="text-xl font-bold mb-4">Chat with AI</h2>

      {/* ✅ Chat messages */}
      <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user"
                ? "chat chat-end"
                : "chat chat-start"
            }
          >
            <div className="chat-bubble whitespace-pre-wrap">
              {msg.parts[0].text}
            </div>
          </div>
        ))}

        {/* ✅ AI typing indicator */}
        {loading && (
          <div className="chat chat-start">
            <div className="chat-bubble">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* ✅ Input form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2"
      >
        <input
          {...register("message", {
            required: true,
            minLength: 2,
          })}
          className="input input-bordered flex-1"
          placeholder="Type your message..."
          autoFocus
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          <Send size={18} />
        </button>
      </form>

      {/* ✅ Validation error */}
      {errors.message && (
        <p className="text-red-500 text-sm mt-2">
          Message must be at least 2 characters
        </p>
      )}
    </div>
  );
};

export default ChatAi;