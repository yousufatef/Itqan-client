# Smart Guide Module - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────┐         ┌──────────────────────────────┐  │
│  │   SmartGuilde Page   │         │    SmartGuideTable           │  │
│  │   (smartGuilde.tsx)  │◄────────│  (SmartGuideTable.tsx)       │  │
│  │                      │         │                              │  │
│  │  [Add Button]────┐   │         │  ┌──────────────────────┐   │  │
│  │  [Title]         │   │         │  │  Columns:            │   │  │
│  │  [Subtitle]      │   │         │  │  - Title EN          │   │  │
│  │                  │   │         │  │  - Title IT          │   │  │
│  └──────────────────┘   │         │  │  - Description EN    │   │  │
│         │                │         │  │  - Description IT    │   │  │
│         │                │         │  │  - Order             │   │  │
│         │                │         │  │  - Actions           │   │  │
│         └────────────────┼─────────│  └──────────────────────┘   │  │
│              │            │         │           ▲                  │  │
│              │            │         │           │                  │  │
│              ▼            │         │           │                  │  │
│         ┌──────────────┐  │         │  ┌─────────────────────┐    │  │
│         │SmartGuideForm│  │         │  │ SmartGuideActions   │    │  │
│         │              │  │         │  │                     │    │  │
│         │ [Title EN]   │  │         │  │ [Edit Button]       │    │  │
│         │ [Title IT]   │  │         │  │ [Delete Button]     │    │  │
│         │ [Desc EN]    │  │         │  │                     │    │  │
│         │ [Desc IT]    │  │         │  └─────────────────────┘    │  │
│         │ [Video]      │  │         │           ▲                  │  │
│         │ [Thumbnail]  │  │         │           │                  │  │
│         │ [Order]      │  │         │           │                  │  │
│         │ [Submit]     │  │         │           │                  │  │
│         └──────┬───────┘  │         │           │                  │  │
│                │           │         │           │                  │  │
└────────────────┼───────────┼─────────┴───────────┼──────────────────┘
                 │           │                     │
┌────────────────┼───────────┼─────────────────────┼──────────────────┐
│  BUSINESS LOGIC LAYER (Hooks)                    │                  │
├────────────────┼───────────┼─────────────────────┼──────────────────┤
│                │           │                     │                  │
│                │      ┌────▼──────────┐     ┌────▼──────────┐       │
│                │      │ useSmartGuide │     │SmartGuideActions │   │
│                │      │ (Query Hook)  │     │                │       │
│                │      │               │     │ [Edit Mode]    │       │
│                │      │ • Fetch data  │     │ [Delete Mode]  │       │
│                │      │ • Search      │     │                │       │
│                │      │ • Pagination  │     └────┬───────────┘       │
│                │      │ • Cache       │          │                  │
│                │      └───────────────┘          │                  │
│                │                                 │                  │
│         ┌──────▼────────────┐         ┌──────────▼──────────┐       │
│         │useCreateSmartGuide│         │useUpdateSmartGuide  │       │
│         │(Mutation Hook)    │         │(Mutation Hook)      │       │
│         │                   │         │                     │       │
│         │ • POST FormData   │         │ • PUT FormData      │       │
│         │ • File upload     │         │ • File upload       │       │
│         │ • Success toast   │         │ • Success toast     │       │
│         │ • Error handling  │         │ • Error handling    │       │
│         │ • Query refresh   │         │ • Query refresh     │       │
│         └─────────┬─────────┘         └──────────┬──────────┘       │
│                   │                              │                  │
│                   │        ┌────────────┐        │                  │
│                   │        │ useDelete  │        │                  │
│                   │        │ SmartGuide │        │                  │
│                   │        │(Mutation)  │        │                  │
│                   │        │            │        │                  │
│                   │        │ • DELETE   │        │                  │
│                   │        │ • Confirm  │        │                  │
│                   │        │ • Toast    │        │                  │
│                   │        │ • Refresh  │        │                  │
│                   │        └────────┬───┘        │                  │
│                   │                 │            │                  │
└───────────────────┼─────────────────┼────────────┼──────────────────┘
                    │                 │            │
┌───────────────────┼─────────────────┼────────────┼──────────────────┐
│  SERVICE LAYER                      │            │                  │
├───────────────────┼─────────────────┼────────────┼──────────────────┤
│                   │                 │            │                  │
│  smart-guide.service.ts             │            │                  │
│                   │                 │            │                  │
│  • getSmartGuides()◄────────────────┼────────────┼──────────────────┤
│  • getSmartGuideById()              │            │                  │
│  • createSmartGuide()◄──────────────┴────────────┼──────────────────┤
│  • updateSmartGuide()◄──────────────────────────┴──────────────────┤
│  • deleteSmartGuide()◄──────────────────────────────────────────────┤
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                │ FormData / Query Params
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│  DATA ACCESS LAYER                                                    │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  API Utils (apiRequest)                                             │
│    • Base URL: VITE_BASE_URL                                        │
│    • Headers: Bearer token                                          │
│    • Error handling                                                 │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP Requests
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│  BACKEND API                                                          │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Base: HowToUseApp/how-to-use-apps                                   │
│  • GET    /paged              (List)                                 │
│  • GET    /{id}               (Get by ID)                            │
│  • POST   /                   (Create)                               │
│  • PUT    /                   (Update)                               │
│  • DELETE /{id}               (Delete)                               │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                │ JSON Response
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│  DATABASE                                                             │
├───────────────────────────────────────────────────────────────────────┤
│  HowToUseApp Table                                                    │
│  • id (UUID)                                                          │
│  • titleEn                                                            │
│  • titleIt                                                            │
│  • descriptionEn                                                      │
│  • descriptionIt                                                      │
│  • thumbnailURL                                                       │
│  • fileUrl (video)                                                    │
│  • order                                                              │
│  • createdOn                                                          │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
SmartGuideApp (Route: /settings/smart-guide)
│
└── SmartGuildePage
    │
    ├── PageLayout
    │   ├── [Title] "Smart Guide"
    │   ├── [Subtitle] "Manage Smart Guide content..."
    │   └── [Add Button] → Opens SmartGuideForm modal
    │
    ├── SmartGuideTable
    │   ├── CustomSearchBar
    │   │   └── Search field
    │   │
    │   ├── Export Button
    │   │
    │   ├── CustomTable
    │   │   ├── Column: Title (EN)
    │   │   ├── Column: Title (IT)
    │   │   ├── Column: Description (EN)
    │   │   ├── Column: Description (IT)
    │   │   ├── Column: Order
    │   │   └── Column: Actions
    │   │       │
    │   │       └── SmartGuideActions
    │   │           ├── [Edit Icon]
    │   │           │   └── Opens form in edit mode
    │   │           │
    │   │           └── [Delete Icon]
    │   │               └── Opens confirmation dialog
    │   │
    │   ├── TableStatistics
    │   │   └── Total count display
    │   │
    │   └── CustomPagination
    │       └── Page navigation
    │
    └── SmartGuideForm (Modal)
        │
        ├── CustomFileUploader
        │   └── Video upload (100MB max)
        │
        ├── CustomInput
        │   ├── Title (EN)
        │   └── Title (IT)
        │
        ├── CustomTextarea
        │   ├── Description (EN)
        │   └── Description (IT)
        │
        ├── CustomFileUploader
        │   └── Thumbnail upload (5MB max, optional)
        │
        └── EditModal
            ├── [Cancel Button]
            └── [Save Button]
```

---

## Data Flow Diagrams

### Create Smart Guide Flow

```
User clicks "Add Smart Guide"
           │
           ▼
SmartGuideForm opens (modal)
           │
           ▼
User fills form:
  • Title EN (required)
  • Title IT (required)
  • Description EN (optional)
  • Description IT (optional)
  • Uploads video (required)
  • Uploads thumbnail (required)
           │
           ▼
User clicks "Save"
           │
           ▼
Form validates with Zod schema
           │
           ├─ Invalid? → Show error messages
           │
           └─ Valid? ▼
             FormData created:
             • TitleEn
             • TitleIt
             • DescriptionEn: "" if empty
             • DescriptionIt: "" if empty
             • Order
             • VideoFile: File | ""
             • ThumbnailFile: File | ""
                    │
                    ▼
             useCreateSmartGuide.mutate(formData)
                    │
                    ▼
             smart-guide.service.createSmartGuide()
                    │
                    ▼
             POST to HowToUseApp/how-to-use-apps
                    │
                    ├─ Error? → Show error toast
                    │
                    └─ Success? ▼
                      • Show success toast
                      • Invalidate query cache
                      • Refresh table
                      • Close modal
                      • Reset form
```

### Edit Smart Guide Flow

```
User clicks Edit icon in table row
           │
           ▼
SmartGuideActions opens form in edit mode
           │
           ▼
Form loads existing data:
  • Title EN
  • Title IT
  • Description EN
  • Description IT
  • Display current thumbnail URL
  • Display current video URL
           │
           ▼
User modifies fields
           │
           ▼
User clicks "Save"
           │
           ▼
Form validates with Zod schema
           │
           ├─ Invalid? → Show error messages
           │
           └─ Valid? ▼
             FormData created:
             • Id: guide.id
             • TitleEn
             • TitleIt
             • DescriptionEn: "" if empty
             • DescriptionIt: "" if empty
             • Order
             • VideoFile: new File | existing URL | ""
             • ThumbnailFile: new File | existing URL | ""
                    │
                    ▼
             useUpdateSmartGuide.mutate(formData)
                    │
                    ▼
             smart-guide.service.updateSmartGuide()
                    │
                    ▼
             PUT to HowToUseApp/how-to-use-apps
                    │
                    ├─ Error? → Show error toast
                    │
                    └─ Success? ▼
                      • Show success toast
                      • Invalidate query cache
                      • Refresh table
                      • Close modal
```

### Delete Smart Guide Flow

```
User clicks Delete icon in table row
           │
           ▼
SmartGuideActions opens confirmation dialog
           │
           ├─ User clicks "Cancel"? → Close dialog
           │
           └─ User clicks "Delete"? ▼
             useDeleteSmartGuide.mutate(guideId)
                    │
                    ▼
             smart-guide.service.deleteSmartGuide()
                    │
                    ▼
             DELETE to HowToUseApp/how-to-use-apps/{id}
                    │
                    ├─ Error? → Show error toast
                    │
                    └─ Success? ▼
                      • Show success toast
                      • Invalidate query cache
                      • Refresh table
                      • Close dialog
```

### List and Search Flow

```
Page loads
           │
           ▼
useSmartGuide hook runs:
           │
           ├─ Get pagination params (pageIndex, pageSize)
           ├─ Get search term
           ├─ Get language
           │
           ▼
Call getSmartGuides(pageIndex, pageSize, searchTerm)
           │
           ▼
API request with query params:
  ?searchTerm=query&pageIndex=1&pageSize=10
           │
           ▼
Backend returns paginated results
           │
           ▼
React Query caches data
           │
           ▼
SmartGuideTable renders:
  • Rows with guide data
  • Pagination controls
  • Statistics
           │
User searches/changes page
           │
           ▼
Query params updated
           │
           ▼
useSmartGuide refetches with new params
           │
           ▼
Table updates with new results
```

---

## State Management

```
Local Component State
├── SmartGuildePage
│   └── isAddingSmartGuide (boolean)
│       • useState
│       • Controls SmartGuideForm visibility
│
├── SmartGuideActions
│   ├── isEditOpen (boolean)
│   └── isDeleteOpen (boolean)
│
└── SmartGuideForm
    └── form (useForm)
        • Managed by react-hook-form
        • Validated by Zod
        • Values, errors, touched


Query State (React Query)
├── useSmartGuide
│   ├── data: HowToUseAppsResponse
│   ├── isLoading: boolean
│   ├── isError: boolean
│   └── error: Error | null
│
├── useCreateSmartGuide
│   ├── isPending: boolean
│   └── error: Error | null
│
├── useUpdateSmartGuide
│   ├── isPending: boolean
│   └── error: Error | null
│
└── useDeleteSmartGuide
    ├── isPending: boolean
    └── error: Error | null


Cache Keys
└── SMART_GUIDE_QUERY_KEY: 'smart-guide'
    └── Invalidated on:
        • Create
        • Update
        • Delete
```

---

## Error Handling Flow

```
API Call
   │
   ├─ Network Error?
   │  └─ Catch & Toast Error
   │
   ├─ 401 Unauthorized?
   │  └─ Redirect to Login
   │
   ├─ 403 Forbidden?
   │  └─ Toast: "Access Denied"
   │
   ├─ 4xx Client Error?
   │  └─ Toast: Error message from API
   │
   └─ 5xx Server Error?
      └─ Toast: "Server error, please try again"
           │
           ├─ UI remains usable
           ├─ Loading spinner stops
           └─ User can retry
```

---

## File Upload Process

```
User selects file
       │
       ▼
CustomFileUploader validates:
  ├─ File type (video/* or image/*)
  ├─ File size (100MB video, 5MB thumbnail)
  └─ File count (1 file)
       │
       ├─ Validation fails?
       │  └─ Toast error + prevent upload
       │
       └─ Validation passes? ▼
         Display preview:
         ├─ Video: Play icon
         ├─ Image: Thumbnail
         └─ Document: File icon
              │
              ▼
         User can remove file
              │
              ├─ Removes? → Clear state
              │
              └─ Keeps? ▼
                Form submission:
                FormData.append('VideoFile', file)
                or
                FormData.append('ThumbnailFile', file)
                     │
                     ▼
                Sent to backend
                     │
                     ▼
                Processed by backend
                     │
                     ▼
                Stored with metadata
```

---

## Translation System

```
i18n/locales/
├── en.json
│   └── smartGuide
│       ├── title: "Smart Guide"
│       ├── form.titleCreate: "Add Smart Guide"
│       ├── form.titleEdit: "Edit Smart Guide"
│       ├── form.video: "Upload Video"
│       ├── form.titleEn: "Title (EN)"
│       ├── form.titleIt: "Title (IT)"
│       ├── form.descriptionEn: "Description (EN)"
│       ├── form.descriptionIt: "Description (IT)"
│       ├── form.thumbnail: "Thumbnail (Optional)"
│       ├── table.titleEn: "Title (EN)"
│       ├── table.titleIt: "Title (IT)"
│       ├── table.descriptionEn: "Description (EN)"
│       ├── table.descriptionIt: "Description (IT)"
│       ├── table.order: "Order"
│       ├── table.actions: "Actions"
│       ├── actions.deleteTitle: "Delete Smart Guide?"
│       ├── actions.deleteDesc: "Are you sure..."
│       ├── actions.deleteSuccess: "Successfully deleted"
│       └── ...more keys
│
└── it.json
    └── smartGuide (Italian translations)
```

---

## Performance Optimization

```
Query Caching
├── useSmartGuide results cached
├── Cache invalidated on mutations
└── Prevents redundant API calls

File Upload Optimization
├── Client-side validation prevents invalid uploads
├── FormData compression by browser
└── Large files uploaded in background

Pagination
├── Load only current page data
├── Reduce initial payload
└── Faster initial render

Search Debouncing
├── Avoid excessive API calls
├── Throttled query updates
└── Better UX

Component Splitting
├── Lazy load form modal
├── Table renders efficiently
└── Reduced bundle size
```

---

## Security Architecture

```
Input Validation
├── Zod schema validation
├── File type checking
├── File size limits
└── Sanitized error messages

Data Protection
├── FormData prevents XSS
├── No sensitive data in logs
├── Bearer token in headers
└── Encrypted in transit (HTTPS)

Error Handling
├── Generic error messages to users
├── Detailed logs for debugging
├── No API endpoint exposure
└── Graceful degradation
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Easy testing and maintenance
- ✅ Scalable component structure
- ✅ Proper error handling
- ✅ Optimal performance
- ✅ Security best practices
