import { Navigate, useParams } from 'react-router-dom';

/** @deprecated Edit role opens as a dialog on RolesManagementPage */
export default function EditRole() {
  const { roleId } = useParams();
  return (
    <Navigate
      to={`/settings/roles?tab=roles&action=edit-role&id=${roleId ?? ''}`}
      replace
    />
  );
}
