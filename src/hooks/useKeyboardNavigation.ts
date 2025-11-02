import { useEffect, useCallback } from "react";
import type { Column } from "../components/KanbanBoard/KanbanBoard.types";

interface UseKeyboardNavigationProps {
  columns: Column[];
  isModalOpen: boolean;
  announcementId?: string;
}


//  Accessible keyboard navigation hook for Kanban boards
 
export function useKeyboardNavigation({
  columns,
  isModalOpen,
  announcementId = "keyboard-navigation-announcements",
}: UseKeyboardNavigationProps) {
  /** Announce changes for screen readers */
  const announce = useCallback(
    (message: string) => {
      const el = document.getElementById(announcementId);
      if (el) el.textContent = message;
    },
    [announcementId]
  );

  // Focus and scroll to a specific task
  const focusTask = useCallback(
    (taskId: string) => {
      const el = document.getElementById(taskId);
      if (!el) return;
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });

      const task = columns.flatMap(c => c.tasks).find(t => t.id === taskId);
      if (task) {
        const col = columns.find(c => c.tasks.some(t => t.id === taskId));
        announce(`Navigated to task: ${task.title} in ${col?.title ?? "Unknown"} column`);
      }
    },
    [columns, announce]
  );

  // Find column/task position
  const findPosition = (taskId: string) => {
    for (let c = 0; c < columns.length; c++) {
      const t = columns[c].tasks.findIndex(x => x.id === taskId);
      if (t !== -1) return { c, t };
    }
    return { c: -1, t: -1 };
  };

  /** Compute next task based on key */
  const getNextTaskId = (key: string, c: number, t: number): string | null => {
    const col = columns[c];
    switch (key) {
      case "ArrowUp":
        return col.tasks[t - 1]?.id ?? columns[c - 1]?.tasks.at(-1)?.id ?? null;
      case "ArrowDown":
        return col.tasks[t + 1]?.id ?? columns[c + 1]?.tasks[0]?.id ?? null;
      case "ArrowLeft":
        return columns[c - 1]?.tasks[Math.min(t, (columns[c - 1]?.tasks.length ?? 1) - 1)]?.id ?? null;
      case "ArrowRight":
        return columns[c + 1]?.tasks[Math.min(t, (columns[c + 1]?.tasks.length ?? 1) - 1)]?.id ?? null;
      case "Home":
        return col.tasks[0]?.id ?? null;
      case "End":
        return col.tasks.at(-1)?.id ?? null;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isModalOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const key = e.key;

      // Skip inputs, modals, etc.
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
        target.isContentEditable
      )
        return;

      const active = document.activeElement as HTMLElement;
      const validKeys = ["Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"];
      if (!validKeys.includes(key)) return;

      e.preventDefault();

      // If nothing interactive is focused → focus first To Do task
      const hasNoFocus =
        active === document.body || !active?.id || active.tagName === "DIV";
      if (key === "Enter" && hasNoFocus) {
        const todo = columns.find(
          c => c.title.toLowerCase() === "to do" || c.id.toLowerCase() === "todo"
        );
        const startCol = todo?.tasks.length ? todo : columns.find(c => c.tasks.length);
        const firstTask = startCol?.tasks[0];
        if (firstTask) {
          focusTask(firstTask.id);
          announce(`Focused first task: ${firstTask.title} in ${startCol?.title}`);
        }
        return;
      }

      // Arrow/Home/End navigation
      if (!active?.id) return;
      const { c, t } = findPosition(active.id);
      if (c === -1) return;

      const nextId = getNextTaskId(key, c, t);
      if (nextId) focusTask(nextId);
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [columns, isModalOpen, focusTask, announce]);
}
