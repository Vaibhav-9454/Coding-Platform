import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description: "Add a new coding problem to the platform",
      icon: Plus,
      color: "btn-success",
      bgColor: "bg-success/10",
      route: "/admin/create",
      actionText: "Create",
    },
    {
      id: "update",
      title: "Update Problem",
      description: "Edit existing problems and their details",
      icon: Edit,
      color: "btn-warning",
      bgColor: "bg-warning/10",
      route: "/admin/update",
      actionText: "Update",
    },
    {
      id: "delete",
      title: "Delete Problem",
      description: "Remove problems from the platform",
      icon: Trash2,
      color: "btn-error",
      bgColor: "bg-error/10",
      route: "/admin/delete",
      actionText: "Delete",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <h1 className="text-3xl font-bold text-center mb-10">
        Admin Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {adminOptions.map((option) => {
          const IconComponent = option.icon;

          return (
            <div
              key={option.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="card-body items-center text-center p-8">

                {/* Icon */}
                <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                  <IconComponent size={32} />
                </div>

                {/* Title */}
                <h2 className="card-title text-xl mb-2">
                  {option.title}
                </h2>

                {/* Description */}
                <p className="text-base-content/70 mb-4">
                  {option.description}
                </p>

                {/* Button */}
                <div className="card-actions">
                  <NavLink
                    to={option.route}
                    className={`btn ${option.color} btn-wide`}
                  >
                    {option.actionText}
                  </NavLink>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;