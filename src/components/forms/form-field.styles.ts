export const formFieldStyles = {
  root: 'grid w-full gap-2',
  label: 'gap-1 max-w-fit type-body-sm text-neutral-900',
  required: 'ms-0.5 text-destructive',
  control:
    'h-auto w-full rounded-[4px] border border-[#BFC1C0] bg-background p-4 text-start text-sm text-foreground opacity-100 shadow-xs transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
  textarea:
    'min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-start text-sm text-foreground shadow-xs transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
  selectTrigger:
    'h-12! w-full rounded-md border border-input bg-background px-3 text-start text-sm text-foreground shadow-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground',
  checkboxRow: 'flex items-center gap-2',
  checkbox:
    'mt-0.5 size-4 rounded-[4px] border-input shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
  helper: 'text-start text-xs leading-5 text-muted-foreground',
  error: 'text-start text-xs font-medium leading-5 text-destructive',
  /** Figma select_hour_desktop (460:58542). */
  timeControl:
    'flex h-14 w-full items-center justify-center rounded-[4px] border border-[#D1CFCC] bg-[#F8F8F8] px-4 transition-[color,box-shadow] focus-within:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
  timeSegment:
    'w-[34px] min-w-[34px] border-0 bg-transparent p-0 text-center tabular-nums type-body-md leading-[22px] text-[#454545] outline-none placeholder:text-[#454545]/45 placeholder:tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-50',
  timeSeparator: 'type-body-md leading-[22px] text-[#454545]/45',
  timeSeparatorFilled: 'type-body-md leading-[22px] text-[#454545]',
  timePeriodTrigger:
    'text-primary-500 inline-flex h-12 shrink-0 items-center gap-1 type-body-md leading-6 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50',
  /** Figma combobox single (460:58634) & multiple (460:58585). */
  comboboxTrigger:
    'flex h-12 w-full items-center justify-between gap-2 rounded-[4px] border border-[#D1CFCC] bg-[#F8F8F8] px-3 type-body-md text-neutral-900 shadow-none transition-colors hover:bg-[#F3F3F3] focus-visible:border-primary-500 focus-visible:ring-1 focus-visible:ring-primary-500/35 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
  comboboxContent:
    'z-50 flex max-h-[350px] w-[var(--radix-popover-trigger-width)] min-w-[320px] flex-col gap-2 rounded-[4px] border border-[#D1CFCC] bg-[#F8F8F8] p-2.5 shadow-lg',
  comboboxSearch:
    'h-[53px] w-full rounded-[4px] border border-[#D6D3CC] bg-[#FBFBFA] py-2 pr-3 pl-[50px] type-body-md text-neutral-900 outline-none placeholder:text-[#8C8A84] focus:border-primary-500 focus:ring-1 focus:ring-primary-500/35',
  comboboxCheckbox:
    'pointer-events-none size-5 shrink-0 rounded-[3px] border-0 shadow-none data-checked:bg-primary-500 data-checked:text-white',
  comboboxCheckboxMultiple:
    'bg-[#F0F0EF] data-checked:bg-primary-500',
  comboboxCheckboxSelectAll:
    'bg-white data-checked:bg-primary-500',
  comboboxOption:
    'group relative flex w-full cursor-pointer items-center gap-2.5 rounded-[2px] border px-2.5 text-start transition-colors outline-none select-none',
  comboboxOptionSelected: 'border-primary-500 bg-[#FBFAF7]',
  comboboxOptionDefault:
    'border-transparent bg-white hover:border-[#E4E0D7] hover:bg-white',
  comboboxThumbnail:
    'flex size-[38px] shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-neutral-200/60 bg-neutral-100',
  /** Figma date range input (488:62275). */
  rangeCalendarTrigger:
    'flex h-12 w-full items-center justify-between gap-2 rounded-[4px] border border-[#D1CFCC] bg-[#F8F8F8] px-3 type-body-md text-neutral-900 shadow-none transition-colors hover:bg-[#F3F3F3] focus-visible:border-primary-500 focus-visible:ring-1 focus-visible:ring-primary-500/35 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
  rangeCalendarContent:
    'z-50 flex flex-col gap-3 overflow-visible rounded-[4px] border border-[#D1CFCC] bg-[#F8F8F8] p-4 shadow-lg',
  rangeCalendarFooter:
    'flex items-center justify-end gap-4 border-t border-neutral-900/20 pt-3',
  rangeCalendarReset:
    'type-body-md text-primary-500 transition-colors hover:text-primary-600',
  rangeCalendarSave:
    'rounded-lg bg-primary-500 px-4 py-1.5 type-body-md text-neutral-900 transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50',
  /** Figma mobile drawer footer (2067:106751). */
  rangeCalendarDrawerFooter: 'flex items-center gap-4 px-4 pb-4 pt-4',
  rangeCalendarDrawerCancel:
    'type-body-md flex h-12 flex-1 items-center justify-center rounded-[4px] border border-primary-500 bg-transparent text-primary-500 transition-colors hover:bg-primary-50',
  rangeCalendarDrawerSave:
    'type-body-md flex h-12 flex-1 items-center justify-center rounded-[4px] bg-primary-500 text-neutral-900 transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50',
};
