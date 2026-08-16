enum Status {
    Active = 1,
    Inactive = 2,
}

interface CustomStatusBadgeProps {
    status?: Status | string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    [Status.Active]: {
        label: "Active",
        className: "bg-success-50 text-success-600",
    },
    [Status.Inactive]: {
        label: "Inactive",
        className: "bg-error-50 text-error-500",
    },
};

const fallbackConfig = {
    label: "Unknown",
    className: "bg-gray-50 text-gray-600",
};

function CustomStatusBadge({ status }: CustomStatusBadgeProps) {
    const { label, className } = statusConfig[status ?? ""] ?? fallbackConfig;

    return (
        <span
            className={`inline-flex items-center p-2 rounded-lg text-sm type-body-md ${className}`}
        >
            {label}
        </span>
    );
}

export default CustomStatusBadge;