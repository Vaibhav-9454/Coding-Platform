import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all problems
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/problem/getAllProblem");
      setProblems(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // Delete problem
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this problem?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await axiosClient.delete(`/problem/delete/${id}`);

      // Optimistic update
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete problem");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Delete Problems</h1>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-error shadow-lg mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={fetchProblems} className="btn btn-sm">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">

            {/* Head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {problems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No problems found
                  </td>
                </tr>
              ) : (
                problems.map((problem, index) => (
                  <tr key={problem._id || index} className="hover">

                    {/* Index */}
                    <th>{index + 1}</th>

                    {/* Title */}
                    <td>{problem.title}</td>

                    {/* Difficulty */}
                    <td>
                      <span
                        className={`badge ${
                          problem.difficulty === "Easy"
                            ? "badge-success"
                            : problem.difficulty === "Medium"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* Tags */}
                    <td>
                      <span className="badge badge-outline">
                        {problem.tags?.join(", ")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <button
                        onClick={() => handleDelete(problem._id)}
                        disabled={deletingId === problem._id}
                        className="btn btn-sm btn-error"
                      >
                        {deletingId === problem._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDelete;