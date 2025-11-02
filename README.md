# Kanban Board Component

> **Frontend Developer Hiring Assignment – Kanban View**

A fully functional, interactive Kanban Board component built with React, TypeScript, Tailwind CSS, and Storybook. This project demonstrates modern frontend development practices including drag-and-drop functionality, responsive design, accessibility compliance, and performance optimization techniques.

## Project Overview

This Kanban Board component is a complete, production-ready implementation showcasing:

- **Drag-and-Drop Functionality**: Seamless task movement between columns using `@dnd-kit`
- **Responsive Design**: Optimized layouts for desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation, ARIA roles, and screen reader support
- **Performance Optimization**: React.memo, lazy loading, and efficient state management
- **Dark Mode Support**: Complete theme switching capability
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions

## Live Demo

- **Storybook (Chromatic)**: [View on Chromatic](https://690700cc0b802e7096e1cd99-yrmnlapovd.chromatic.com/)
- **Production Deployment**: [View on Vercel](https://kanban-component-kshitiz-jain.vercel.app/)

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation Steps

1. **Clone or download the repository**

```bash
cd kanbanBoard_Assignment
```

2. **Install dependencies**

```bash
npm install
```

3. **Run Storybook locally**

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006` and open it in your default browser.

4. **Build Storybook for production**

```bash
npm run build-storybook
```

This generates a static build in the `storybook-static` directory, ready for deployment.

5. **Deploy to Chromatic** (optional)

```bash
npm run chromatic
```

### Additional Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build the production bundle
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build

## Features Checklist

### Core Functionality

- **Drag-and-Drop Tasks**: Move tasks between columns with smooth animations
- **Task Management**: Create, edit, and delete tasks with a modal interface
- **Priority System**: Four priority levels (low, medium, high, urgent) with visual indicators
- **Due Date Tracking**: Date management with overdue detection and formatting
- **Assignee Support**: User avatars and assignee information
- **Tags System**: Multiple tags per task for categorization
- **Column Management**: Reorderable columns with task count indicators

### User Experience

- **Responsive Layouts**: Adapts seamlessly to desktop, tablet, and mobile viewports
- **Dark Mode**: Toggle between light and dark themes
- **Empty States**: Helpful messaging when columns have no tasks
- **Loading States**: Smooth transitions and loading indicators
- **Error Handling**: Graceful error states and user feedback

### Accessibility (A11y)

- **Keyboard Navigation**: Full keyboard support for all interactions
  - Tab/Shift+Tab to navigate between elements
  - Enter/Space to pick up and drop cards
  - Arrow keys for directional movement
  - Escape to cancel actions
- **ARIA Attributes**: Proper ARIA roles, labels, and live regions
- **Focus Management**: Visible focus indicators and logical tab order
- **Screen Reader Support**: Semantic HTML and ARIA labels for assistive technologies
- **Color Contrast**: WCAG AA compliant color schemes

### Performance

- **React.memo**: Component memoization to prevent unnecessary re-renders
- **Lazy Loading**: Code splitting for modal components
- **Efficient State Management**: Optimized state updates and minimal re-renders
- **Virtual Scrolling**: Ready for large datasets (can be extended)

## Architecture / Folder Structure

```
kanban/
├── .storybook/              # Storybook configuration files
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── KanbanBoard/     # Main Kanban Board components
│   │   │   ├── KanbanBoard.tsx          # Main board container
│   │   │   ├── KanbanBoard.stories.ts   # Storybook stories
│   │   │   ├── KanbanBoard.types.ts     # TypeScript type definitions
│   │   │   ├── KanbanCard.tsx           # Individual task card component
│   │   │   ├── KanbanColumn.tsx         # Column container component
│   │   │   └── TaskModal.tsx            # Task creation/edit modal
│   │   └── primitives/      # Reusable UI primitives
│   │       ├── Avatar.tsx
│   │       └── Button.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useDragAndDrop.ts        # Drag and drop logic
│   │   ├── useKanbanBoard.ts        # Board state management
│   │   └── useKeyboardNavigation.ts # Keyboard accessibility
│   ├── utils/               # Utility functions
│   │   ├── column.utils.ts # Column manipulation helpers
│   │   └── task.utils.ts   # Task manipulation helpers
│   ├── styles/
│   │   └── globals.css     # Global styles and Tailwind directives
│   ├── App.tsx             # Root application component
│   └── main.tsx            # Application entry point
├── package.json
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

### Design Approach

The project follows a **modular, component-based architecture** with clear separation of concerns:

- **Components**: Reusable, self-contained UI components with props-based configuration
- **Hooks**: Custom hooks encapsulate complex logic (`useDragAndDrop`, `useKanbanBoard`, `useKeyboardNavigation`)
- **Utils**: Pure utility functions for data manipulation and transformations
- **Types**: Centralized TypeScript definitions for type safety across the application

### Key Design Decisions

1. **`@dnd-kit` Library**: Chosen for modern, accessible drag-and-drop with excellent TypeScript support
2. **Custom Hooks Pattern**: Encapsulates drag-and-drop logic, board state, and keyboard navigation separately
3. **Lazy Loading**: TaskModal is lazy-loaded to improve initial bundle size
4. **Type Safety**: Comprehensive TypeScript types for Tasks, Columns, and all component props
5. **Tailwind CSS**: Utility-first CSS for rapid, maintainable styling

## Storybook Stories

The component includes **8 comprehensive stories** demonstrating various use cases and states:

### 1. **Default Board** (`Default`)
   - Standard Kanban board with sample tasks across all columns
   - Demonstrates typical usage with mixed priorities and assignees

### 2. **Dark Mode** (`DarkMode`)
   - Same as Default but in dark theme
   - Shows theme consistency and contrast compliance

### 3. **Empty State** (`EmptyState`)
   - Board with no tasks in any column
   - Demonstrates helpful empty state messaging and UI

### 4. **Large Dataset** (`ManyTasks`)
   - Column with 15+ tasks to test performance and scrolling
   - Validates handling of larger task lists

### 5. **Mobile Responsive View** (`MobileView`)
   - Configured with mobile viewport settings
   - Tests responsive breakpoints and touch interactions

### 6. **Priority Demonstration** (`DifferentPriorities`)
   - Showcases all four priority levels (low, medium, high, urgent)
   - Visual priority indicators with color coding

### 7. **Interactive Playground** (`InteractivePlayground`)
   - Full Storybook controls enabled
   - Allows reviewers to interactively test component props

### 8. **Accessibility Demo** (`AccessibilityDemo`)
   - Includes keyboard navigation instructions
   - Demonstrates ARIA implementation and screen reader support

All stories include comprehensive documentation and use Storybook's autodocs feature for automatic prop table generation.

## Technologies Used

### Core Technologies

- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Storybook 10.0.2** - Component development and documentation

### Libraries & Tools

- **@dnd-kit/core** (v6.3.1) - Drag and drop functionality
- **@dnd-kit/sortable** (v10.0.0) - Sortable list support
- **date-fns** (v4.1.0) - Date formatting and manipulation
- **react-icons** (v5.5.0) - Icon library
- **clsx** (v2.1.1) - Conditional className utility
- **Vite** (v7.1.7) - Fast build tool and dev server

### Storybook Addons

- **@storybook/addon-a11y** - Accessibility testing and checks
- **@storybook/addon-docs** - Enhanced documentation
- **@storybook/addon-vitest** - Component testing integration
- **@chromatic-com/storybook** - Visual testing and deployment

## Performance & Accessibility

### Performance Optimizations

1. **React.memo**: Components wrapped with `React.memo` to prevent unnecessary re-renders
2. **Lazy Loading**: `TaskModal` component is lazy-loaded using `React.lazy()`
3. **Memoized Callbacks**: `useCallback` hooks for event handlers to maintain referential equality
4. **Efficient State Updates**: Minimal state updates with optimized data structures
5. **Code Splitting**: Ready for further virtualization if handling very large datasets

### Accessibility Features

1. **ARIA Implementation**:
   - `role="button"` for interactive elements
   - `aria-label` and `aria-labelledby` for descriptive labels
   - `aria-live` regions for dynamic content updates
   - `aria-atomic` and `aria-relevant` attributes

2. **Keyboard Navigation**:
   - Full keyboard support for all drag-and-drop operations
   - Logical tab order throughout the interface
   - Escape key to cancel operations
   - Arrow keys for directional navigation

3. **Focus Management**:
   - Visible focus indicators on all interactive elements
   - Focus trapping in modals
   - Programmatic focus management for accessibility

4. **Semantic HTML**:
   - Proper heading hierarchy
   - Semantic HTML elements (`<main>`, `<section>`, `<article>`)
   - Descriptive button and link text

5. **Color Contrast**: WCAG AA compliant color schemes in both light and dark modes

## Contribution / Contact

**Developer**: Kshitiz Jain  
**Email**: kshitizjain2020@gmail.com


For questions, feedback, or contributions to this assignment submission, please reach out via the email above.

## License

This project is part of the Design System Component Library's hiring assignment. All submitted code remains the author's intellectual property.

---

**Built for the Frontend Developer Hiring Assignment**
