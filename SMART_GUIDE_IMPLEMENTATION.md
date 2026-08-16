# Smart Guide Module Implementation - Complete

## Overview
Successfully implemented a complete Smart Guide management module for the Luca-Admin-Redesign application with full CRUD operations (Create, Read, Update, Delete) for managing smart guide content.

## API Specifications

### Endpoints

#### 1. **GET - List Smart Guides (Paginated)**
- **Endpoint:** `HowToUseApp/how-to-use-apps/paged`
- **Query Parameters:** `searchTerm`, `pageIndex`, `pageSize`
- **Response:** Paginated list of smart guides

#### 2. **GET - Get Smart Guide by ID**
- **Endpoint:** `HowToUseApp/how-to-use-apps/{id}`
- **Response:** Single smart guide details

#### 3. **POST - Create Smart Guide**
- **Endpoint:** `HowToUseApp/how-to-use-apps`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Form Data Parameters:**
  - `TitleEn` (string, required) - English title
  - `TitleIt` (string, required) - Italian title
  - `DescriptionEn` (string, optional) - English description (send empty string if not provided)
  - `DescriptionIt` (string, optional) - Italian description (send empty string if not provided)
  - `Order` (integer, optional) - Display order
  - `VideoFile` (binary, optional) - Video file upload (send empty string if no file)
  - `ThumbnailFile` (binary, optional) - Thumbnail image file (send empty string if no file)

#### 4. **PUT - Update/Edit Smart Guide**
- **Endpoint:** `HowToUseApp/how-to-use-apps`
- **Method:** PUT
- **Content-Type:** multipart/form-data
- **Form Data Parameters:**
  - `Id` (string, required, UUID format)
  - `TitleEn` (string, required)
  - `TitleIt` (string, required)
  - `DescriptionEn` (string, optional) - send empty string if not provided
  - `DescriptionIt` (string, optional) - send empty string if not provided
  - `Order` (integer, optional)
  - `VideoFile` (binary, optional) - send empty string if no file
  - `ThumbnailFile` (binary, optional) - send empty string if no file

#### 5. **DELETE - Delete Smart Guide**
- **Endpoint:** `HowToUseApp/how-to-use-apps/{id}`
- **Method:** DELETE
- **Parameter:** `id` (string, UUID format)

## Module Structure

```
src/modules/(settings)/smart-guide/
├── components/
│   ├── SmartGuideForm.tsx          # Form for create/edit operations
│   └── table/
│       ├── SmartGuideTable.tsx     # Table display with search and pagination
│       └── SmartGuideActions.tsx   # Edit/Delete action buttons
├── constants/
│   └── smartGuide.constants.ts     # Query keys and constants
├── hooks/
│   ├── useSmartGuide.tsx           # Fetch smart guides (read)
│   ├── useCreateSmartGuide.ts      # Create smart guide
│   ├── useUpdateSmartGuide.ts      # Update smart guide
│   └── useDeleteSmartGuide.ts      # Delete smart guide
├── pages/
│   └── smartGuilde.tsx              # Main page component
├── services/
│   └── smart-guide.service.ts      # API calls
└── types/
    ├── smart-guide.types.ts        # TypeScript interfaces
    └── smart-guide.schema.ts       # Zod validation schema
```

## Key Features

### 1. **Form Component (SmartGuideForm.tsx)**
- Bilingual input fields (English & Italian)
- Video file upload support
- Thumbnail image upload (optional)
- Order/sequence number field
- Descriptions for both languages
- Full validation using Zod schema
- Handles both create and edit modes

### 2. **Table Component (SmartGuideTable.tsx)**
- Displays paginated list of smart guides
- Search functionality
- Column headers: Title (EN), Title (IT), Description (EN), Description (IT), Order, Actions
- Export button (UI ready)
- Statistics showing total count
- Pagination controls

### 3. **Actions Component (SmartGuideActions.tsx)**
- Edit button - Opens form in edit mode
- Delete button - Opens confirmation dialog
- Confirmation dialog before deletion
- Loading states during operations

### 4. **Service Layer (smart-guide.service.ts)**
- All API endpoints implemented
- FormData handling for file uploads
- Query parameter generation
- Proper error handling

### 5. **Hooks**
- **useSmartGuide** - Fetch data with pagination, search, and language support
- **useCreateSmartGuide** - Mutation for creating new guides
- **useUpdateSmartGuide** - Mutation for updating existing guides
- **useDeleteSmartGuide** - Mutation for deleting guides

## Usage Guide

### Create a Smart Guide
```typescript
// Opens form modal
<Button onClick={() => setIsAddingSmartGuide(true)}>
  Add Smart Guide
</Button>

// Form component
<SmartGuideForm
  isOpen={isAddingSmartGuide}
  setIsOpen={setIsAddingSmartGuide}
/>
```

### Viewing Smart Guides
The main page displays a table with all smart guides:
- Search by title or description
- Sort using pagination
- View details through table columns

### Edit Smart Guide
Click the edit icon in the actions column to modify existing guides.

### Delete Smart Guide
Click the delete icon to remove a guide (requires confirmation).

## Translations

Translations are included for both English and Italian:

### English (en.json)
- Form labels, placeholders, and validation messages
- Table headers
- Action confirmations
- Helper text and descriptions

### Italian (it.json)
- Complete Italian translations
- Culturally appropriate terminology
- Consistent with project standards

## Form Data Handling

The implementation correctly handles multipart/form-data for file uploads:

```typescript
const formData = new FormData();
formData.append('TitleEn', values.titleEn);
formData.append('TitleIt', values.titleIt);
formData.append('DescriptionEn', values.descriptionEn || '');
formData.append('DescriptionIt', values.descriptionIt || '');
formData.append('Order', values.order?.toString() || '0');
formData.append('VideoFile', videoFile instanceof File ? videoFile : '');
formData.append('ThumbnailFile', thumbnailFile instanceof File ? thumbnailFile : '');
```

## Validation

- **Zod Schema** validation ensures data integrity
- Required fields: TitleEn, TitleIt
- Optional fields: Descriptions, Order, Video, Thumbnail
- File upload constraints: Video (100MB max), Thumbnail (5MB max)
- File type restrictions enforced on upload

## State Management

- Uses **React Query** (@tanstack/react-query) for:
  - Caching
  - Pagination
  - Search term management
  - Automatic refetching on mutations
  - Loading and error states

## UI Components Used

- **CustomFileUploader** - For video and thumbnail uploads
- **CustomInput** - For title fields
- **CustomTextarea** - For descriptions
- **EditModal** - For form display
- **CustomTable** - For data display
- **CustomSearchBar** - For search functionality
- **CustomPagination** - For navigation

## Build Status

✅ **Build Successful** - No compilation errors
- All TypeScript types correct
- All imports resolved
- All components integrated
- Production build verified

## API Integration Points

1. **Service Layer** (`smart-guide.service.ts`)
   - Handles all HTTP requests
   - Uses `apiRequest` utility
   - Properly serializes FormData

2. **Hooks Layer**
   - Mutations with React Query
   - Success/error handling
   - Query invalidation for data refresh

3. **Component Layer**
   - Form submission handling
   - Modal state management
   - Table data display
   - User interactions

## Testing Recommendations

1. Test form submission with all fields populated
2. Test form submission with optional fields empty
3. Test file uploads with various file sizes
4. Test search functionality
5. Test pagination with multiple pages
6. Test edit mode with existing data
7. Test delete confirmation flow
8. Test error handling for failed requests

## Future Enhancements

- Add drag-and-drop for file uploads
- Add video preview before upload
- Add thumbnail preview
- Add bulk operations (delete multiple)
- Add sorting by column
- Add filtering options
- Add export to CSV/Excel
- Add activity logging

## Notes

- All empty file uploads send empty string to API (as per specification)
- Empty optional fields send empty strings to API
- Form uses FormData for proper file handling
- Query invalidation ensures fresh data after mutations
- Proper error toast notifications for user feedback
