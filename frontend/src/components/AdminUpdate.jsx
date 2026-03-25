import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axiosClient.get("/problem/getAllProblem");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        setProblems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Handle update
  const handleUpdate = async () => {
    try {
      await axiosClient.put(
        `/problem/update/${selectedProblem._id}`,
        selectedProblem
      );

      alert("Updated successfully");

      // Update list locally
      setProblems((prev) =>
        prev.map((p) =>
          p._id === selectedProblem._id ? selectedProblem : p
        )
      );

      setSelectedProblem(null); // go back to list
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // 🔴 LOADING
  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">

      {/* ================= LIST VIEW ================= */}
      {!selectedProblem && (
        <>
          <h1 className="text-2xl font-bold mb-4">Select Problem to Update</h1>

          {problems.length === 0 ? (
            <p>No problems found</p>
          ) : (
            problems.map((p) => (
              <div
                key={p._id}
                className="border p-3 mb-2 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{p.title}</h2>

                  <span className="text-sm text-gray-500">
                    {Array.isArray(p.tags)
                      ? p.tags.join(", ")
                      : p.tags || "No tags"}
                  </span>
                </div>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => setSelectedProblem(p)}
                >
                  Edit
                </button>
              </div>
            ))
          )}
        </>
      )}

      {/* ================= EDIT VIEW ================= */}
      {selectedProblem && (
        <>
          <h1 className="text-2xl font-bold mb-4">Update Problem</h1>

          <div className="space-y-3">

            {/* Title */}
            <input
              className="input input-bordered w-full"
              value={selectedProblem.title}
              onChange={(e) =>
                setSelectedProblem({
                  ...selectedProblem,
                  title: e.target.value,
                })
              }
            />

            {/* Description */}
            <textarea
              className="textarea textarea-bordered w-full"
              value={selectedProblem.description}
              onChange={(e) =>
                setSelectedProblem({
                  ...selectedProblem,
                  description: e.target.value,
                })
              }
            />

            {/* Difficulty */}
            <select
              className="select select-bordered w-full"
              value={selectedProblem.difficulty}
              onChange={(e) =>
                setSelectedProblem({
                  ...selectedProblem,
                  difficulty: e.target.value,
                })
              }
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Save
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => setSelectedProblem(null)}
              >
                Cancel
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default AdminUpdate;