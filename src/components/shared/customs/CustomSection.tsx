type CustomSectionProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
};
export default function CustomSection({ children, title, description }: CustomSectionProps) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h2 className='type-heading-sm text-neutral-900'>{title}</h2>
        <p className='type-body-md text-neutral-400'>{description}</p>
      </div>
      {children}
    </div>
  );
}
