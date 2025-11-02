import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import type { Task, Column } from './KanbanBoard.types';

// Sample data for the Kanban board
const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Create UI Components',
    description: 'Build reusable UI components for the application',
    priority: 'high',
    columnId: 'todo',
    assignee: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    tags: ['UI', 'Design', 'Frontend'],
    dueDate: new Date(Date.now() + 86400000 * 3) // 3 days from now
  },
  {
    id: 'task-2',
    title: 'Implement Drag and Drop',
    description: 'Add drag and drop functionality to the Kanban board',
    priority: 'medium',
    columnId: 'in-progress',
    assignee: {
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    tags: ['Feature', 'Interaction'],
    dueDate: new Date(Date.now() + 86400000 * 5) // 5 days from now
  },
  {
    id: 'task-3',
    title: 'Write Unit Tests',
    description: 'Create unit tests for all components',
    priority: 'low',
    columnId: 'todo',
    assignee: {
      name: 'Bob Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    tags: ['Testing', 'QA'],
    dueDate: new Date(Date.now() + 86400000 * 7) // 7 days from now
  },
  {
    id: 'task-4',
    title: 'Fix Accessibility Issues',
    description: 'Ensure all components are accessible',
    priority: 'urgent',
    columnId: 'review',
    assignee: {
      name: 'Alice Brown',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    tags: ['A11y', 'Bug'],
    dueDate: new Date(Date.now() - 86400000) // 1 day ago (overdue)
  },
  {
    id: 'task-5',
    title: 'Deploy to Production',
    description: 'Deploy the application to production environment',
    priority: 'high',
    columnId: 'done',
    assignee: {
      name: 'Charlie Wilson',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    tags: ['DevOps', 'Release'],
    dueDate: new Date(Date.now() - 86400000 * 2) // 2 days ago
  }
];

// Create sample columns with tasks
const sampleColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: sampleTasks.filter(task => task.columnId === 'todo')
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: sampleTasks.filter(task => task.columnId === 'in-progress')
  },
  {
    id: 'review',
    title: 'Review',
    tasks: sampleTasks.filter(task => task.columnId === 'review')
  },
  {
    id: 'done',
    title: 'Done',
    tasks: sampleTasks.filter(task => task.columnId === 'done')
  }
];

// Empty columns for the Empty state story
const emptyColumns: Column[] = [
  { id: 'todo', title: 'To Do', tasks: [] },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'review', title: 'Review', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] }
];

const meta = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    darkMode: { control: 'boolean' }
  },
} satisfies Meta<typeof KanbanBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for dark mode toggle functionality
const DarkModeWrapper: React.FC<{ args: any }> = ({ args }) => {
  const [darkMode, setDarkMode] = useState(args.darkMode ?? false);
  return React.createElement(KanbanBoard, {
    ...args,
    darkMode: darkMode,
    onToggleDarkMode: () => setDarkMode(!darkMode)
  });
};

// Default story with sample data
export const Default: Story = {
  args: {
    initialColumns: sampleColumns,
    darkMode: false
  },
  render: (args) => React.createElement(DarkModeWrapper, { args }),
};

// Dark mode story
export const DarkMode: Story = {
  args: {
    initialColumns: sampleColumns,
    darkMode: true
  },
};

// Empty state story
export const EmptyState: Story = {
  args: {
    initialColumns: emptyColumns,
    darkMode: false
  },
};

// Many tasks story
export const ManyTasks: Story = {
  args: {
    initialColumns: [
      {
        id: 'todo',
        title: 'To Do',
        tasks: Array(15).fill(null).map((_, index) => ({
          id: `many-task-${index}`,
          title: `Task ${index + 1}`,
          description: `Description for task ${index + 1}`,
          priority: (['low', 'medium', 'high', 'urgent'] as const)[index % 4],
          columnId: 'todo',
          tags: [`Tag ${index % 3 + 1}`],
          dueDate: new Date(Date.now() + 86400000 * (index % 10))
        }))
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        tasks: []
      },
      {
        id: 'review',
        title: 'Review',
        tasks: []
      },
      {
        id: 'done',
        title: 'Done',
        tasks: []
      }
    ],
    darkMode: false
  },
};

// Mobile view story
export const MobileView: Story = {
  args: {
    initialColumns: sampleColumns,
    darkMode: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
};

// Different priorities demo: shows all four priorities distinctly
export const DifferentPriorities: Story = {
  args: {
    initialColumns: [
      {
        id: 'prio-demo',
        title: 'Priority Demo',
        tasks: [
          {
            id: 'prio-low',
            title: 'Low Priority',
            description: 'This is a low priority task.',
            priority: 'low',
            columnId: 'prio-demo',
            tags: ['Low'],
            dueDate: new Date(Date.now() + 86400000 * 2),
          },
          {
            id: 'prio-medium',
            title: 'Medium Priority',
            description: 'This is a medium priority task.',
            priority: 'medium',
            columnId: 'prio-demo',
            tags: ['Medium'],
            dueDate: new Date(Date.now() + 86400000 * 5),
          },
          {
            id: 'prio-high',
            title: 'High Priority',
            description: 'This is a high priority task.',
            priority: 'high',
            columnId: 'prio-demo',
            tags: ['High'],
            dueDate: new Date(Date.now() + 86400000 * 7),
          },
          {
            id: 'prio-urgent',
            title: 'Urgent Priority',
            description: 'This task is urgent!',
            priority: 'urgent',
            columnId: 'prio-demo',
            tags: ['Urgent'],
            dueDate: new Date(Date.now() - 86400000), // overdue!
          },
        ],
      },
    ],
    darkMode: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays all four priority levels (low, medium, high, urgent) with color coding as required by the assignment.',
      },
    },
  },
};

// Interactive Playground demo: can use Storybook controls to modify board props
export const InteractivePlayground: Story = {
  args: {
    initialColumns: sampleColumns,
    darkMode: false,
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        story:
          'Try changing the columns or toggling darkMode via controls. Allows interactive testing of Kanban props for reviewers.',
      },
    },
  },
};

// Accessibility demo: includes keyboard/nav instructions for reviewers
export const AccessibilityDemo: Story = {
  args: {
    initialColumns: sampleColumns,
    darkMode: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Accessibility demo: \n\n- Use Tab / Shift+Tab to move focus between tasks and columns.\n- Use Enter or Space to pick up (drag) a card.\n- Use arrow keys to move it across droppable zones or within columns.\n- Escape cancels/TaskModal closes.\n- All controls have appropriate ARIA markup and visible focus outlines.\n- Try with a screen reader for ARIA labels.',
      },
    },
  },
};

