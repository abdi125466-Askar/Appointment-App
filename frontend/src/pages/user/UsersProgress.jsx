import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersProgress } from "./usersProgressSlice";

export default function UsersProgress() {
  const dispatch = useDispatch();

  // ✅ Correct selector (separate slice)
  const { data = [], loading = false, error = null } = useSelector(
    (state) => state.usersProgress || {}
  );

  useEffect(() => {
    dispatch(fetchUsersProgress());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-blue-600 font-semibold animate-pulse">
          Loading users progress...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">
        Users Performance Overview
      </h2>

      {data.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No user progress data available.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((user) => (
            <div
              key={user.userId}
              className="bg-white shadow-md rounded-xl p-5 border border-blue-100 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {user.fullName}
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                {user.role}
              </p>

              {/* Completion */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Completion</span>
                  <span>{user.completionPercentage}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${user.completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Performance */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Performance</span>
                  <span>{user.performanceScore}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${user.performanceScore}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 text-xs text-gray-500 grid grid-cols-2 gap-2">
                <div>Total: {user.totalAssigned}</div>
                <div>Completed: {user.completed}</div>
                <div>Approved: {user.approved}</div>
                <div>No Show: {user.noShow}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}