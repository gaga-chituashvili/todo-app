import { useState } from "react";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "../hooks/useTodos";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import type { Todo, TodoFilters, TodoStatus, TodoPriority } from "../types";

const STATUS_BADGE: Record<TodoStatus, string> = {
  PENDING: "badge badge-pending",
  IN_PROGRESS: "badge badge-in-progress",
  COMPLETED: "badge badge-completed",
};

const PRIORITY_BADGE: Record<TodoPriority, string> = {
  LOW: "badge badge-low",
  MEDIUM: "badge badge-medium",
  HIGH: "badge badge-high",
};

const STATUS_ICON: Record<TodoStatus, React.ReactNode> = {
  PENDING: <Clock size={11} />,
  IN_PROGRESS: <AlertCircle size={11} />,
  COMPLETED: <CheckCircle size={11} />,
};

interface TodoFormData {
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string;
}

const EMPTY_FORM: TodoFormData = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "",
};

function TodoModal({ todo, onClose }: { todo?: Todo; onClose: () => void }) {
  const [form, setForm] = useState<TodoFormData>(
    todo
      ? {
          title: todo.title,
          description: todo.description || "",
          status: todo.status,
          priority: todo.priority,
          dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : "",
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (form.title.length > 200) e.title = "Title too long";
    if (
      form.dueDate &&
      new Date(form.dueDate) < new Date(new Date().toDateString())
    ) {
      e.dueDate = "Due date cannot be in the past";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      description: form.description || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    };
    try {
      if (todo) {
        await updateTodo.mutateAsync({ id: todo.id, data: payload });
        toast.success("Todo updated!");
      } else {
        await createTodo.mutateAsync(payload);
        toast.success("Todo created!");
      }
      onClose();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { error?: string } } }).response?.data?.error || "Something went wrong");
    }
  };

  const isPending = createTodo.isPending || updateTodo.isPending;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
            {todo ? "Edit Todo" : "New Todo"}
          </h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label className="label">Title *</label>
            <input
              className="input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && (
              <p
                style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              placeholder="Add details..."
              rows={3}
              style={{ resize: "vertical" }}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as TodoStatus })
                }
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select
                className="input"
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as TodoPriority })
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Due Date</label>
            <input
              type="date"
              className="input"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            {errors.dueDate && (
              <p
                style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.dueDate}
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center", padding: "11px" }}
            >
              <Check size={16} />{" "}
              {isPending ? "Saving..." : todo ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: "11px 20px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function DeleteConfirm({ todo, onClose }: { todo: Todo; onClose: () => void }) {
  const deleteTodo = useDeleteTodo();

  const handleDelete = async () => {
    try {
      await deleteTodo.mutateAsync(todo.id);
      toast.success("Todo deleted!");
      onClose();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "28px",
          width: "100%",
          maxWidth: "380px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗑️</div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
          Delete Todo?
        </h3>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
          "<strong>{todo.title}</strong>" will be permanently deleted.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleDelete}
            disabled={deleteTodo.isPending}
            className="btn-danger"
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Trash2 size={15} />{" "}
            {deleteTodo.isPending ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function TodosPage() {
  const [filters, setFilters] = useState<TodoFilters>({
    sortBy: "createdAt",
    order: "desc",
  });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [deleteTodo, setDeleteTodo] = useState<Todo | null>(null);

  const { data, isLoading } = useTodos({
    ...filters,
    search: search || undefined,
  });
  const todos: Todo[] = data?.todos || [];

  const updateTodo = useUpdateTodo();

  const toggleStatus = async (todo: Todo) => {
    const next: TodoStatus =
      todo.status === "PENDING"
        ? "IN_PROGRESS"
        : todo.status === "IN_PROGRESS"
          ? "COMPLETED"
          : "PENDING";
    await updateTodo.mutateAsync({ id: todo.id, data: { status: next } });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a" }}>
            My Todos
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "2px" }}>
            {data?.total || 0} tasks total
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> New Todo
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            />
            <input
              className="input"
              placeholder="Search todos..."
              style={{ paddingLeft: "36px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="input"
            style={{ width: "auto" }}
            value={filters.status || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: (e.target.value as TodoStatus) || undefined,
              })
            }
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            className="input"
            style={{ width: "auto" }}
            value={filters.priority || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                priority: (e.target.value as TodoPriority) || undefined,
              })
            }
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            className="input"
            style={{ width: "auto" }}
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split("-");
              setFilters({
                ...filters,
                sortBy: sortBy as unknown as TodoFilters["sortBy"],
                order: order as unknown as TodoFilters["order"],
              });
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date ↑</option>
            <option value="dueDate-desc">Due Date ↓</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "80px" }} />
          ))}
        </div>
      ) : todos.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <h3
            style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}
          >
            No todos found
          </h3>
          <p
            style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}
          >
            {search || filters.status || filters.priority
              ? "Try adjusting your filters"
              : "Create your first todo!"}
          </p>
          {!search && !filters.status && !filters.priority && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
              style={{ margin: "0 auto" }}
            >
              <Plus size={16} /> Create Todo
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <AnimatePresence>
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  cursor: "default",
                }}
              >
                <button
                  onClick={() => toggleStatus(todo)}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    border: `2px solid ${todo.status === "COMPLETED" ? "#059669" : "#d1d5db"}`,
                    background:
                      todo.status === "COMPLETED" ? "#059669" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    marginTop: "2px",
                    transition: "all 0.2s",
                  }}
                >
                  {todo.status === "COMPLETED" && (
                    <Check size={12} color="white" />
                  )}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "4px",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "15px",
                        textDecoration:
                          todo.status === "COMPLETED" ? "line-through" : "none",
                        color:
                          todo.status === "COMPLETED" ? "#9ca3af" : "#0f172a",
                      }}
                    >
                      {todo.title}
                    </p>
                    <span className={STATUS_BADGE[todo.status]}>
                      {STATUS_ICON[todo.status]} {todo.status.replace("_", " ")}
                    </span>
                    <span className={PRIORITY_BADGE[todo.priority]}>
                      {todo.priority}
                    </span>
                  </div>
                  {todo.description && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      {todo.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      fontSize: "12px",
                      color: "#9ca3af",
                    }}
                  >
                    <span>
                      Created {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                    {todo.dueDate && (
                      <span
                        style={{
                          color:
                            new Date(todo.dueDate) < new Date() &&
                            todo.status !== "COMPLETED"
                              ? "#ef4444"
                              : "#9ca3af",
                        }}
                      >
                        Due {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button
                    onClick={() => setEditTodo(todo)}
                    style={{
                      border: "none",
                      background: "#f1f5f9",
                      borderRadius: "6px",
                      padding: "6px",
                      cursor: "pointer",
                      color: "#6b7280",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTodo(todo)}
                    style={{
                      border: "none",
                      background: "#fef2f2",
                      borderRadius: "6px",
                      padding: "6px",
                      cursor: "pointer",
                      color: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {(showModal || editTodo) && (
          <TodoModal
            todo={editTodo || undefined}
            onClose={() => {
              setShowModal(false);
              setEditTodo(null);
            }}
          />
        )}
        {deleteTodo && (
          <DeleteConfirm
            todo={deleteTodo}
            onClose={() => setDeleteTodo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
