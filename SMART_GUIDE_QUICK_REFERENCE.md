# Smart Guide Module - Quick Reference

## File Structure at a Glance

```
smart-guide/
├── SmartGuideForm.tsx          ← Create/Edit form
├── SmartGuideTable.tsx         ← List view with search
├── SmartGuideActions.tsx       ← Edit/Delete buttons
├── useSmartGuide.tsx           ← Fetch hook (GET)
├── useCreateSmartGuide.ts      ← Create hook (POST)
├── useUpdateSmartGuide.ts      ← Update hook (PUT)
├── useDeleteSmartGuide.ts      ← Delete hook (DELETE)
├── smart-guide.service.ts      ← API calls
├── smart-guide.types.ts        ← TypeScript types
└── smart-guide.schema.ts       ← Zod validation
```

## API Quick Reference

| Operation | Method | Endpoint | FormData |
|-----------|--------|----------|----------|
| List | GET | `HowToUseApp/how-to-use-apps/paged` | searchTerm, pageIndex, pageSize |
| Get | GET | `HowToUseApp/how-to-use-apps/{id}` | - |
| Create | POST | `HowToUseApp/how-to-use-apps` | See Form Data below |
| Update | PUT | `HowToUseApp/how-to-use-apps` | Id + Form Data |
| Delete | DELETE | `HowToUseApp/how-to-use-apps/{id}` | - |

## Form Data Fields

```typescript
// All create operations
TitleEn: string (required)
TitleIt: string (required)
DescriptionEn: string (optional, send "")
DescriptionIt: string (optional, send "")
Order: number (optional)
VideoFile: File | "" (optional)
ThumbnailFile: File | "" (optional)

// Edit operations (add Id)
Id: string (UUID, required)
...rest same as create
```

## Common Tasks

### Display Smart Guide List
```tsx
import SmartGuileepage from '@/modules/(settings)/smart-guide/pages/smartGuilde';
```

### Use in Another Component
```tsx
import useSmartGuide from '@/modules/(settings)/smart-guide/hooks/useSmartGuide';

const { data, isLoading, error } = useSmartGuide();
```

### Create Smart Guide Programmatically
```tsx
import useCreateSmartGuide from '@/modules/(settings)/smart-guide/hooks/useCreateSmartGuide';

const { mutate } = useCreateSmartGuide({ onSuccess: () => console.log('Created') });

const formData = new FormData();
formData.append('TitleEn', 'My Guide');
formData.append('TitleIt', 'La Mia Guida');
mutate(formData);
```

### Delete Smart Guide
```tsx
import useDeleteSmartGuide from '@/modules/(settings)/smart-guide/hooks/useDeleteSmartGuide';

const { mutate } = useDeleteSmartGuide();
mutate(guideId);
```

## Key Components

### SmartGuideForm
- Props: `isOpen`, `setIsOpen`, `smartGuide?` (optional for edit)
- Handles file uploads
- Auto-validates using Zod schema
- Shows loading state during submission

### SmartGuideTable
- Auto-fetches data
- Shows search bar
- Displays pagination
- Actions: Edit, Delete

### SmartGuideActions
- Edit button → Opens form
- Delete button → Opens confirmation
- Used in table actions column

## Translations

Find translations in:
- `src/i18n/locales/en.json` - English
- `src/i18n/locales/it.json` - Italian

Keys:
- `smartGuide.title` - Page title
- `smartGuide.form.*` - Form labels
- `smartGuide.table.*` - Table headers
- `smartGuide.actions.*` - Action labels

## Error Handling

All hooks automatically:
- Show success toast on completion
- Show error toast on failure
- Invalidate query cache
- Handle loading states

## File Upload Validation

- **Video**: Max 100MB, `video/*` types
- **Thumbnail**: Max 5MB, `image/*` types
- Auto-reject invalid files with toast
- Show file preview after selection

## Database Type Mapping

```typescript
HowToUseApp {
  id: string (UUID)
  titleEn: string
  titleIt: string
  descriptionEn: string
  descriptionIt: string
  thumbnailURL: string
  fileUrl: string
  order: number
  createdOn: string (datetime)
}
```

## Important Notes

1. ✅ **FormData handling** - Always send empty string for empty files
2. ✅ **Required fields** - TitleEn and TitleIt must always be provided
3. ✅ **Optional fields** - Send empty strings, not undefined
4. ✅ **File uploads** - Use FormData, not JSON
5. ✅ **Query key** - `SMART_GUIDE_QUERY_KEY` for cache invalidation
6. ✅ **Pagination** - pageIndex is 1-based (1, 2, 3...)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Form not submitting | Check TitleEn and TitleIt are filled |
| Files not uploading | Ensure using FormData, not JSON |
| Data not updating | Check query key invalidation |
| Validation errors | Check Zod schema for field names |
| Translations missing | Check i18n/locales/*.json |

## Build & Deployment

```bash
# Build
npm run build

# Lint
npm run lint

# Format
npm run format
```

Build is ✅ passing with no errors.

## Performance Considerations

- Uses React Query caching
- Pagination prevents loading all data
- Search debounces API calls
- File uploads happen in background
- Modal lazy loads form component

## Security

- FormData prevents XSS
- File type validation client-side
- File size limits enforced
- No sensitive data in logs
- Error messages sanitized

---

For detailed information, see `SMART_GUIDE_IMPLEMENTATION.md`
