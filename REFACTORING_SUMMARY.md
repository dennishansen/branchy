# Tree View Component Refactoring

This project implements a refactoring of the tree view component according to modern React patterns using hooks, context, and reducer pattern.

## Key Changes

### 1. Created `useTreeState` Hook

- Implemented with `useReducer` instead of layered `useState` calls
- Defined action types: SET_TEXT, TOGGLE_EXPANDED, UPDATE_CHILD_STATE, MERGE_REMOTE_CHILDREN
- Returns `{state, dispatch}` instead of multiple updater callbacks
- Located in `src/hooks/useTreeState.ts`

### 2. Created `TreeProvider` Context

- Holds the tree state and dispatch function in context
- Provides access to state management across the component tree
- Eliminates prop drilling through the tree hierarchy
- Located in `src/context/TreeContext.tsx`

### 3. Extracted OpenAI Logic into `useOpenAIChildren` Hook

- Separates OpenAI API handling from UI components
- Manages streaming content, parsing, and state updates
- Makes the components unaware of OpenAI implementation details
- Located in `src/hooks/useOpenAIChildren.ts`

### 4. Updated Components

- `TreeViewer`: Simplified to use the TreeProvider context
- `TreeNode`: Removed prop drilling, uses contexts and hooks
- Clean separation of concerns between UI and API integration

## Benefits

- **Improved Code Organization**: Each part of the system has a clear responsibility
- **Reduced Prop Drilling**: No need to pass multiple props through component layers
- **Better Testability**: Isolated hooks and business logic are easier to test
- **Simplified Components**: UI components focus only on rendering
- **More Maintainable**: Changes to state management or API integration can be made in isolation
