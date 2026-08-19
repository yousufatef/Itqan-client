# Itqan Dashboard — API Reference

Complete API endpoint documentation for all modules. All paths are relative to `VITE_BASE_URL`. Authenticated requests use `Authorization: Bearer {token}` unless noted otherwise.

**Architecture:** `Page → Hook → Service (api-*.ts) → fetch(VITE_BASE_URL/endpoint)`

---

## Table of Contents

- [Auth](#auth)
- [Buildings](#buildings)
- [Apartments](#apartments)
- [Reservations](#reservations)
- [Services](#services)
- [Workspaces](#workspaces)
- [Financials](#financials)
- [Controls](#controls)
- [Settings](#settings)

---

## Auth

**Routes:** `/signin`, `/forget-password`, `/otp`, `/reset-password`  
**Service files:** `src/services/api-auth.ts`, `src/services/api -users.ts`  
**Hooks:** `src/hooks/features/auth/`

| Method | Endpoint | Function | Auth | Description |
|--------|----------|----------|------|-------------|
| GET | `Users/userData` | `getCurrentUser` | Bearer | Get current logged-in user data |
| POST | `Account/adminLogin` | `loginApi` | — | Admin login with email and password |
| POST | `Account/refreshToken` | `refreshTokenApi` | Bearer | Refresh access token |
| POST | `Account/sendForgetPasswordOtp?emailOrPhoneNumber={email}` | `forgetPasswordApi` | — | Send OTP for password recovery |
| POST | `Account/validateOtp` | `otpApi` | — | Validate OTP code |
| POST | `Account/forgetPassword` | `resetPasswordApi` | — | Reset password with OTP |
| POST | `Users/resetPassword` | `resetPasswordUserApi` | Bearer | Reset admin user password |

---

## Buildings

**Routes:** `/buildings`, `/buildings/:id`, `/buildings/structures`, `/buildings/amenities`, `/buildings/amenities-types`  
**Service files:** `src/services/api-buildings.ts`, `src/services/api-buildings-levels.ts`, `src/services/api-structures.ts`  
**Hooks:** `src/hooks/features/buildings/`

### Buildings

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Buildings/allBuildings` | `getAllBuildings` | Get all buildings (no pagination) |
| GET | `Buildings/all-commercial-buildings` | `getCommercialBuildings` | Get all commercial buildings |
| GET | `Buildings?pageIndex={n}&pageSize={n}&searchValue={q}` | `getBuildings` | Paginated buildings list |
| POST | `Buildings` | `createBuildingApi` | Create building (FormData) |
| PUT | `Buildings` | `editBuildingApi` | Update building (FormData) |
| DELETE | `Buildings?id={id}` | `deleteBuildingApi` | Delete building |

### Building Levels

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `BuildingLeves?buildingId={id}&searchValue={q}&pageSize={n}&pageIndex={n}` | `getBuildingLevels` | Paginated building levels |
| POST | `BuildingLeves` | `createBuildingLevelApi` | Create building level |
| PUT | `BuildingLeves` | `editBuildingLevelApi` | Update building level |
| DELETE | `BuildingLeves?id={id}` | `deleteBuildingLevelApi` | Delete building level |

### Structure Types

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `StructureTypes/StructureTypes` | `getAllStructuresApi` | Get all structure types |
| GET | `StructureTypes/StructureTypesPagination?searchValue={q}&type={t}&pageSize={n}&pageIndex={n}` | `getStructuresApi` | Paginated structure types |
| POST | `StructureTypes/createStructureType` | `createStructuresApi` | Create structure type |
| PUT | `StructureTypes/editStructureType` | `editStructuresApi` | Update structure type |
| DELETE | `StructureTypes/deleteStructureType?structureTypeId={id}` | `deleteStructuresApi` | Delete structure type |

### Amenities

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Amenities/amentiesPagination?pageIndex={n}&pageSize={n}&searchValue={q}&amenityIds={ids}` | `getAmenities` | Paginated amenities |
| GET | `Amenities/allAmenityTypesWithAmenities` | `getAllAmenityTypesWithAmenities` | All amenity types with amenities |
| POST | `Amenities/createAmenity` | `createAmenityApi` | Create amenity |
| PUT | `Amenities/editAmenity` | `editAmenityApi` | Update amenity |
| DELETE | `Amenities/deleteAmenity?amenityId={id}` | `deleteAmenityApi` | Delete amenity |

### Amenity Types

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Amenities/amenityTypesPagination?pageIndex={n}&pageSize={n}&searchValue={q}` | `getAmenityTypes` | Paginated amenity types |
| GET | `Amenities/allAmenityTypes` | `getAllAmenityTypes` | Get all amenity types |
| POST | `Amenities/createAmenityType` | `createAmenityTypeApi` | Create amenity type (FormData) |
| PUT | `Amenities/editAmenityType` | `editAmenityTypeApi` | Update amenity type (FormData) |
| DELETE | `Amenities/deleteAmenityType?amenityTypeId={id}` | `deleteAmenityTypesApi` | Delete amenity type |

### Apartments (Buildings context)

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Apartments/apartments?pageIndex={n}&pageSize={n}&searchValue={q}` | `getApartments` | Paginated apartments (global) |
| DELETE | `Apartments/deleteApartment?apartmentId={id}` | `deleteApartmentApi` | Delete apartment |

---

## Apartments

**Routes:** `/apartments`, `/apartments/:id`, `/apartments/:id/devices`  
**Service files:** `src/services/api-apartments.ts`, `src/services/api-apartment-devices.ts`, `src/services/api-images.ts`  
**Hooks:** `src/hooks/features/buildings/apartments/`

### Apartments

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Apartments/allPaginatedV2?PageNumber={n}&PageSize={n}&searchValue={q}` | `getAllApartments` | Paginated apartments (v2) |
| GET | `Apartments/allPaginated?buildingId={id}&pageIndex={n}&pageSize={n}&searchValue={q}` | `getApartments` | Paginated apartments by building |
| GET | `Apartments/apartmentDetails?apartmentId={id}` | `getApartment` | Get apartment details |
| POST | `Apartments/createApartment` | `createApartmentApi` | Create apartment (FormData) |
| PUT | `Apartments/updateApartment` | `editApartmentApi` | Update apartment (FormData) |
| DELETE | `Apartments/deleteApartment?apartmentId={id}` | `deleteApartmentApi` | Delete apartment |

### Apartment Images

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| POST | `ApartmentImages/createList` | `createApartmentImagesApi` | Upload apartment images (FormData) |
| DELETE | `ApartmentImages/deleteImage?imageId={id}` | `deleteApartmentImageApi` | Delete apartment image |
| DELETE | `{dynamic url}` | `deleteImageApi` | Delete image by dynamic URL |

### Apartment Devices

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `ApartmentDevices/GetAllDevicesByApartmentId?apartmentId={id}` | `getApartmentDevices` | Get devices for an apartment |
| POST | `ApartmentDevices` | `addApartmentDeviceApi` | Add device to apartment |
| PUT | `ApartmentDevices` | `updateApartmentDeviceApi` | Update apartment device |
| DELETE | `ApartmentDevices/?id={id}` | `deleteApartmentDeviceApi` | Delete apartment device |

---

## Reservations

**Routes:** `/reservations`, `/reservations/calendar`, `/reservations/list`, `/reservations/global-time`  
**Service file:** `src/services/api-reservations.ts`  
**Hooks:** `src/hooks/features/reservations/`

### Bookings

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Bookings/allReservations?pageNumber={n}&pageSize={n}&SearchTerm={q}&DateFrom={from}&DateTo={to}&BookingApartmentStatus={status}&PaymentStatus={status}` | `getAllReservations` | Paginated reservations with filters |
| GET | `Bookings/buildingBookings?buildingId={id}` | `getReservationsByBuildingId` | Reservations by building |
| GET | `Bookings/availableApartmentsInBuilding?buildingId={id}&dateFrom={from}&dateTo={to}` | `getAvailableApartments` | Available apartments in date range |
| GET | `Bookings/available-apartments/{bookingId}` | `getAvailableApartmentsToSwitch` | Apartments available for switch |
| GET | `Bookings/calculatePriceWithTaxes?apartmentId={id}&from={from}&to={to}&guestsCount={n}` | `getReservationTotalPrice` | Calculate booking price with taxes |
| GET | `Bookings/generate-URL?bookingId={id}` | `getReservationUrl` | Generate reservation share URL |
| POST | `Bookings/submitAdminBooking` | `createReservationApi` | Create admin booking |
| PUT | `Bookings/updatePaymentStatus` | `updatePaymentStatus` | Update payment status (FormData) |
| PUT | `Bookings/updateGuestStatus` | `updateGuestStatus` | Update guest check-in status (FormData) |
| PUT | `Bookings/updateBookingDuration?bookingId={id}&to={to}&from={from}` | `editReservationTimeApi` | Update booking time duration |
| PUT | `Bookings/extend-booking-period/{bookingId}?newDateTo={to}&newDateFrom={from}` | `editReservationDateApi` | Extend booking period |
| PUT | `Bookings/assign-apartment/{bookingId}?newApartmentId={id}` | `switchApartmentApi` | Switch apartment for booking |
| PUT | `Bookings/update-booking-final` | `editReservationApi` | Final booking update |

### Booking Times

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `BookingTimes/global-booking-timing` | `getReservationGlobalTimeApi` | Get global check-in/check-out times |
| POST | `BookingTimes/update-global-booking-timing` | `editReservationGlobalTimeApi` | Update global booking timing |

### External Integrations

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `SmartQI/get-reservation/{reservationId}` | `getReservationQRCode` | Get reservation QR code |
| POST | `KrossBooking/get-prices-and-availability` | `getApartmentsPrices` | Get prices and availability from KrossBooking |

---

## Services

**Routes:** `/services`, `/services/services-types`, `/services/requests`, `/services/package-items`  
**Service files:** `src/services/api-services.ts`, `src/services/api-invoices.ts`  
**Hooks:** `src/hooks/features/services/`

### Service Requests

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `ServiceRequests/service-request-paginated?pageNumber={n}&pageSize={n}&searchTerm={q}&serviceRequestDate={date}&status={status}` | `getServiceRequests` | Paginated service requests |
| GET | `ServiceRequests/all-service-requests` | `getAllServiceRequests` | Get all service requests |
| GET | `ServiceRequests/service-request/details?serviceRequestId={id}` | `getServiceRequestApi` | Get service request details |
| PUT | `ServiceRequests/service-request-status?id={id}&newStatus={status}` | `editRequestStatusApi` | Update request status |

### Service Types

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `ServiceTypes/paginated?pageNumber={n}&pageSize={n}&searchTerm={q}` | `getServiceTypes` | Paginated service types |
| GET | `ServiceTypes/all` | `getAllServiceTypes` | Get all service types |
| POST | `ServiceTypes/create` | `createServiceTypeApi` | Create service type |
| PUT | `ServiceTypes/update` | `editServiceTypeApi` | Update service type |
| DELETE | `ServiceTypes/Id?Id={id}` | `deleteServiceTypesApi` | Delete service type |

### Room Services

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `RoomService/paginated?pageNumber={n}&pageSize={n}&searchTerm={q}` | `getServices` | Paginated room services |
| GET | `RoomService/all` | `getAllServices` | Get all room services |
| POST | `RoomService/create` | `createServiceApi` | Create room service (FormData) |
| POST | `RoomService/assign-packages-and-update` | `editServiceApi` | Update service and assign packages (FormData) |
| POST | `RoomService/unassign-packages` | `unassignServicePackageApi` | Unassign package from service |
| DELETE | `RoomService/Id?Id={id}` | `deleteServiceApi` | Delete room service |

### Package Items

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `PackageItems/items-paginated?pageNumber={n}&pageSize={n}&searchTerm={q}` | `getPackageItems` | Paginated package items |
| GET | `PackageItems/items/all` | `getAllPackageItems` | Get all package items |
| POST | `PackageItems/create` | `createPackageItemApi` | Create package item (FormData) |
| PUT | `PackageItems/items/update` | `editPackageItemApi` | Update package item (FormData) |
| DELETE | `PackageItems/items/id?id={id}` | `deletePackageItemApi` | Delete package item |

### Service Packages

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `ServicePackages/get-all?pageNumber={n}&pageSize={n}&searchTerm={q}` | `getServicePackages` | Paginated service packages |
| GET | `ServicePackages/get-all` | `getAllServicePackages` | Get all service packages |
| POST | `ServicePackages/create` | `createServicePackageApi` | Create service package |
| PUT | `PackageItems/edit-and-assign-items` | `editServicePackageApi` | Edit package and assign items |
| PUT | `PackageItems/package-image` | `createServicePackageApi`, `editServicePackageApi` | Upload package image (FormData) |
| DELETE | `PackageItems/items/id?id={id}` | `deleteServicePackageApi` | Delete service package |

---

## Workspaces

**Routes:** `/workspaces`, `/workspaces/reservations`, `/workspaces/OfficeReservationsPage`, `/workspaces/:id/devices`  
**Service files:** `src/services/api-workspaces.ts`, `src/services/api-office-devices.ts`  
**Hooks:** `src/hooks/features/workspaces/`

### Office Types

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `offices/office-type/paginated?pageNumber={n}&pageSize={n}&searchTerm={q}` | `getOfficeTypes` | Paginated office types |
| GET | `offices/office-type/all` | `getAllOfficeTypes` | Get all office types |
| POST | `offices/office-type` | `createOfficeTypeApi` | Create office type |
| PUT | `offices/office-type` | `editOfficeTypeApi` | Update office type |
| DELETE | `offices/office-type/{id}` | `deleteOfficeTypeApi` | Delete office type |

### Offices

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `offices/paginated?pageNumber={n}&pageSize={n}&searchTerm={q}` | `getOffices` | Paginated offices |
| GET | `Offices/getAll` | `getAllOffices` | Get all offices |
| GET | `Offices/by-building/{buildingId}` | `getOfficeByBuilding` | Get offices by building |
| GET | `Amenities/commercial-amenities` | `getAllCommercialAmenityTypes` | Get commercial amenities |
| POST | `Offices/create` | `createOfficeApi` | Create office |
| POST | `Offices/uploadImages` | `createOfficeApi`, `editOfficeApi` | Upload office images (FormData) |
| PUT | `Offices/edit` | `editOfficeApi` | Update office |
| PUT | `offices/toggle-active` | `editOfficeStatusApi` | Toggle office active status (FormData) |
| DELETE | `offices/delete/{id}` | `deleteOfficeApi` | Delete office |
| DELETE | `Offices/delete?officeId={id}` | `removeOfficeApi` | Remove office |

### Office Reservations

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `OfficeReservations/admin/reservations?pageNumber={n}&pageSize={n}&searchTerm={q}&startDate={date}` | `getOfficeReservations` | Paginated office reservations |
| GET | `OfficeReservations/admin-office-calendar?officeId={id}&startDate={from}&endDate={to}` | `getOfficeReservationsCalendar` | Calendar reservations for office |
| POST | `OfficeReservations/admin-available-offices` | `getCheckavailablityOffices` | Check available offices |
| POST | `OfficeReservations/admin` | `createOfficeReservationApi` | Create office reservation |
| GET | `OfficeReservations/generate-URL?reservationId={id}` | `generateReservationUrlApi` | Generate reservation share URL |

### Office Devices

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `OfficeDevices/GetAllDevicesByOfficeId?officeId={id}` | `getOfficeDevices` | Get devices for an office |
| POST | `OfficeDevices` | `addOfficeDeviceApi` | Add device to office |
| PUT | `OfficeDevices` | `updateOfficeDeviceApi` | Update office device |
| DELETE | `OfficeDevices/{id}` | `deleteOfficeDeviceApi` | Delete office device |

---

## Financials

**Routes:** `/financials/invoices`, `/financials/taxes`, `/financials/promos`  
**Service files:** `src/services/api-invoices.ts`, `src/services/api-taxes.ts`, `src/services/api-promo-codes.ts`  
**Hooks:** `src/hooks/features/financials/`

### Invoices

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Invoices/paginated-by-booking?searchTerm={q}&pageSize={n}&pageNumber={n}&apartmentIds={ids}&invoiceDate={date}` | `getInvoicesApi` | Paginated invoices by booking |
| GET | `Invoices?bookingId={id}` | `getInvoiceApi` | Get invoice by booking ID |

### Taxes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Taxes/paginated?searchValue={q}&pageIndex={n}&pageSize={n}` | `getTaxesApi` | Paginated taxes |
| POST | `Taxes` | `createTaxesApi` | Create tax |
| PUT | `Taxes/update` | `editTaxesApi` | Update tax |
| DELETE | `Taxes/{taxId}` | `deleteTaxesApi` | Delete tax |

### Promo Codes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `PromoCodes/all` | `getAllPromoCodesApi` | Get all promo codes |
| GET | `PromoCodes/paginated?searchTerm={q}&pageIndex={n}&pageSize={n}` | `getPromoCodesApi` | Paginated promo codes |
| POST | `PromoCodes/create` | `createPromoCodeApi` | Create promo code |
| PUT | `PromoCodes/update/{id}` | `editPromoCodeApi` | Update promo code |
| PATCH | `PromoCodes/update-status/{id}?isActive={bool}` | `togglePromoCodeStatusApi` | Toggle promo code active status |
| DELETE | `PromoCodes/{promoCodeId}` | `deletePromoCodeApi` | Delete promo code |

---

## Controls

**Routes:** `/devices`, `/devices/controls`, `/devices/settings`  
**Service files:** `src/services/api-devices.ts`, `src/services/api-control-devices.ts`  
**Hooks:** `src/hooks/features/controls/`

### Devices

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Devices?PageNumber={n}&PageSize={n}` | `getAllDevices` | Paginated devices list |
| POST | `Devices` | `createDeviceApi` | Create device |
| PUT | `Devices` | `editDeviceApi` | Update device |
| DELETE | `Devices/?id={deviceId}` | `deleteDeviceApi` | Delete device |

### IoT Settings

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `IotSettings` | `getDevicesIPAddress` | Get IoT IP address settings |
| PUT | `IotSettings` | `editDevicesIPAddressApi` | Update IoT IP address settings |

### Temperature Controls

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `TempControls/all-paginated?PageNumber={n}&PageSize={n}&search={q}` | `getAllControlDevices` | Paginated temp control devices |
| POST | `TempControls/create` | `createControlDeviceApi` | Create temp control device |
| PUT | `TempControls/update-datetime` | `editControlDeviceApi` | Update temp control schedule |
| DELETE | `TempControls/{deviceId}` | `deleteControlDeviceApi` | Delete temp control device |

---

## Settings

**Routes:** `/settings/users`, `/settings/cities`, `/settings/guests`, `/settings/rules`  
**Service files:** `src/services/api-settings.ts`, `src/services/api-guests.ts`, `src/services/api -users.ts`  
**Hooks:** `src/hooks/features/settings/`

### Users (Admins)

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Users/Users` | `getAllUsersApi` | Get all users |
| GET | `Users/all-admins?SearchTerm={q}&PageSize={n}&PageNumber={n}` | `getUsersApi` | Paginated admin users |
| POST | `Users/create-admin` | `createUserApi` | Create admin user (FormData) |
| POST | `Users/edit-admin` | `editUserApi` | Update admin user (FormData) |
| DELETE | `Users/adminId?adminId={id}` | `deleteUserApi` | Delete admin user |
| POST | `Users/resetPassword` | `resetPasswordUserApi` | Reset admin password |
| PUT | `Users/suspend-admin/{adminId}` | `suspendAdminApi` | Suspend admin user |

### Roles & Permissions

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `PermissionRoles/paginated?PageNumber={n}&PageSize={n}&SearchTerm={q}` | `getRoles` | Paginated roles |
| GET | `PermissionRoles/all` | `getAllRoles` | Get all roles |
| POST | `PermissionRoles/by-name` | `createRoleApi` | Create role with permissions |
| PUT | `PermissionRoles/by-name` | `editRoleApi` | Update role with permissions |
| DELETE | `PermissionRoles/id?id={id}` | `deleteRoleApi` | Delete role |

### Cities

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Cities/citiesPagination?searchValue={q}&pageSize={n}&pageIndex={n}` | `getCities` | Paginated cities |
| GET | `Cities/allCities` | `getAllCities` | Get all cities |
| POST | `Cities/createCity` | `createCityApi` | Create city |
| PUT | `Cities/editCity` | `editCityApi` | Update city |
| DELETE | `Cities/deleteCity?cityId={id}` | `deleteCityApi` | Delete city |

### Guests

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Guests/Guests` | `getAllGuestsApi` | Get all guests |
| GET | `Guests/GuestsPagination?searchValue={q}&pageSize={n}&pageIndex={n}` | `getGuestsApi` | Paginated guests |
| POST | `Guests/createGuest` | `createGuestApi` | Create guest |
| PUT | `Guests/editGuest` | `editGuestApi` | Update guest |
| DELETE | `Guests/deleteGuest?id={id}` | `deleteGuestApi` | Delete guest |

### Rules

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `Rules/rulesPagination?pageIndex={n}&pageSize={n}&searchValue={q}` | `getRules` | Paginated booking rules |
| GET | `Rules/allRules` | `getAllRules` | Get all rules |
| POST | `Rules/createRule` | `createRuleApi` | Create rule |
| PUT | `Rules/editRule` | `editRuleApi` | Update rule |
| DELETE | `Rules/deleteRule?ruleId={id}` | `deleteRuleApi` | Delete rule |

---

## Service Files Index

| File | Module |
|------|--------|
| `api-auth.ts` | Authentication |
| `api-settings.ts` | Users, Roles, Cities, Rules |
| `api-guests.ts` | Guests |
| `api -users.ts` | Admin password reset, suspend |
| `api-buildings.ts` | Buildings, Amenities |
| `api-buildings-levels.ts` | Building Levels |
| `api-structures.ts` | Structure Types |
| `api-apartments.ts` | Apartments |
| `api-apartment-devices.ts` | Apartment Devices |
| `api-images.ts` | Image deletion |
| `api-reservations.ts` | Bookings |
| `api-services.ts` | Room Services, Packages |
| `api-workspaces.ts` | Offices, Office Reservations |
| `api-office-devices.ts` | Office Devices |
| `api-invoices.ts` | Invoices |
| `api-taxes.ts` | Taxes |
| `api-promo-codes.ts` | Promo Codes |
| `api-devices.ts` | IoT Devices |
| `api-control-devices.ts` | Temperature Controls |
