import { memo } from 'react';

import type React from 'react';

type IconProps = {
  name: string;
  fill?: string;
  stroke?: string;
  className?: string;
};
const SidebarIcon = ({ name, fill = 'currentColor', stroke, className = '' }: IconProps) => {
  const iconMap: Record<string, React.ReactElement> = {
    test: (
      <svg
        width='20'
        className={className}
        height='20'
        viewBox='0 0 20 20'
        fill={fill}
        stroke={stroke}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M9.22 0.21934C9.36063 0.0788896 9.55125 0 9.75 0C9.94875 0 10.1394 0.0788896 10.28 0.21934L14.78 4.71934C14.9125 4.86152 14.9846 5.04956 14.9812 5.24386C14.9777 5.43816 14.899 5.62355 14.7616 5.76096C14.6242 5.89837 14.4388 5.97709 14.2445 5.98052C14.0502 5.98394 13.8622 5.91182 13.72 5.77934L10.5 2.55934V14.2493C10.5 14.4483 10.421 14.639 10.2803 14.7797C10.1397 14.9203 9.94891 14.9993 9.75 14.9993C9.55109 14.9993 9.36032 14.9203 9.21967 14.7797C9.07902 14.639 9 14.4483 9 14.2493V2.55934L5.78 5.77934C5.63783 5.91182 5.44978 5.98394 5.25548 5.98052C5.06118 5.97709 4.87579 5.89837 4.73838 5.76096C4.60097 5.62355 4.52225 5.43816 4.51883 5.24386C4.5154 5.04956 4.58752 4.86152 4.72 4.71934L9.22 0.21934ZM0.75 13.4993C0.948912 13.4993 1.13968 13.5784 1.28033 13.719C1.42098 13.8597 1.5 14.0504 1.5 14.2493V16.4993C1.5 16.8972 1.65804 17.2787 1.93934 17.56C2.22064 17.8413 2.60218 17.9993 3 17.9993H16.5C16.8978 17.9993 17.2794 17.8413 17.5607 17.56C17.842 17.2787 18 16.8972 18 16.4993V14.2493C18 14.0504 18.079 13.8597 18.2197 13.719C18.3603 13.5784 18.5511 13.4993 18.75 13.4993C18.9489 13.4993 19.1397 13.5784 19.2803 13.719C19.421 13.8597 19.5 14.0504 19.5 14.2493V16.4993C19.5 17.295 19.1839 18.0581 18.6213 18.6207C18.0587 19.1833 17.2956 19.4993 16.5 19.4993H3C2.20435 19.4993 1.44129 19.1833 0.87868 18.6207C0.316071 18.0581 0 17.295 0 16.4993V14.2493C0 14.0504 0.0790175 13.8597 0.21967 13.719C0.360322 13.5784 0.551088 13.4993 0.75 13.4993Z'
          fill='#151716'
        />
      </svg>
    ),
    reservations: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1933_32521)">
          <path d="M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_1933_32521">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

    ),
    services: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1933_32563)">
        <path d="M3 20C2.73478 20 2.48043 19.8946 2.29289 19.7071C2.10536 19.5196 2 19.2652 2 19V18C2 17.4696 2.21071 16.9609 2.58579 16.5858C2.96086 16.2107 3.46957 16 4 16H20C20.5304 16 21.0391 16.2107 21.4142 16.5858C21.7893 16.9609 22 17.4696 22 18V19C22 19.2652 21.8946 19.5196 21.7071 19.7071C21.5196 19.8946 21.2652 20 21 20H3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 16C20 13.8783 19.1571 11.8434 17.6569 10.3431C16.1566 8.84285 14.1217 8 12 8C9.87827 8 7.84344 8.84285 6.34315 10.3431C4.84285 11.8434 4 13.8783 4 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 4V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10 4H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1933_32563">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    ),
    buildings: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1933_32578)">
        <path d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22H6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 12H4C3.46957 12 2.96086 12.2107 2.58579 12.5858C2.21071 12.9609 2 13.4696 2 14V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M18 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10 6H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10 10H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10 14H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10 18H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1933_32578">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    ),
    users: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21V19C16 16.7909 14.2091 15 12 15H6C3.79086 15 2 16.7909 2 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M22 21V19C22 17.1362 20.7252 15.5701 19 15.126" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.12891C17.7252 3.57193 19 5.13812 19 7.00195C19 8.86579 17.7252 10.432 16 10.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),

    students: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9L12 4L21 9L12 14L3 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 11V16C6 18.2091 8.68629 20 12 20C15.3137 20 18 18.2091 18 16V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 9V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21" cy="17" r="1" fill="currentColor" />
      </svg>
    ),

    circles: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 6.5C10.8 5.55 9.35 5 7.75 5C6.32 5 4.95 5.44 4 6.2V19C5.1 18.3 6.4 18 7.75 18C9.35 18 10.8 18.55 12 19.5M12 6.5C13.2 5.55 14.65 5 16.25 5C17.68 5 19.05 5.44 20 6.2V19C18.9 18.3 17.6 18 16.25 18C14.65 18 13.2 18.55 12 19.5M12 6.5V19.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 9H9M7 12H9M15 9H17M15 12H17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    financial: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1933_32596)">
        <path d="M4 10H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4 14H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M18.9997 6.00003C17.5767 4.70768 15.7219 3.99427 13.7997 4.00003C12.7622 4.01308 11.7375 4.23037 10.784 4.63949C9.83049 5.0486 8.96694 5.64153 8.24262 6.38442C7.51831 7.1273 6.94743 8.00559 6.56258 8.96913C6.17773 9.93266 5.98645 10.9626 5.99966 12C5.99966 16.4 9.49966 20 13.7997 20C15.7997 20 17.5997 19.2 18.9997 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1933_32596">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    ),
    devices: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1933_32610)">
        <path d="M18 8V6C18 5.46957 17.7893 4.96086 17.4142 4.58579C17.0391 4.21071 16.5304 4 16 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V13C2 13.5304 2.21071 14.0391 2.58579 14.4142C2.96086 14.7893 3.46957 15 4 15H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10 19V15.04V18.19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M7 19H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 12H18C16.8954 12 16 12.8954 16 14V20C16 21.1046 16.8954 22 18 22H20C21.1046 22 22 21.1046 22 20V14C22 12.8954 21.1046 12 20 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1933_32610">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    ),
    dashboard: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1933_32507)">
        <path d="M9 3H4C3.44772 3 3 3.44772 3 4V11C3 11.5523 3.44772 12 4 12H9C9.55228 12 10 11.5523 10 11V4C10 3.44772 9.55228 3 9 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 3H15C14.4477 3 14 3.44772 14 4V7C14 7.55228 14.4477 8 15 8H20C20.5523 8 21 7.55228 21 7V4C21 3.44772 20.5523 3 20 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 12H15C14.4477 12 14 12.4477 14 13V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V13C21 12.4477 20.5523 12 20 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9 16H4C3.44772 16 3 16.4477 3 17V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V17C10 16.4477 9.55228 16 9 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1933_32507">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    ),
    settings: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1933_32628)">
        <path d="M9.6713 4.13615C9.7264 3.55649 9.99564 3.0182 10.4264 2.62643C10.8572 2.23467 11.4185 2.01758 12.0008 2.01758C12.5831 2.01758 13.1444 2.23467 13.5752 2.62643C14.006 3.0182 14.2752 3.55649 14.3303 4.13615C14.3634 4.51061 14.4863 4.87157 14.6884 5.18849C14.8906 5.50541 15.1662 5.76896 15.4918 5.95683C15.8174 6.1447 16.1834 6.25135 16.559 6.26777C16.9346 6.28419 17.3085 6.20989 17.6493 6.05115C18.1784 5.81093 18.778 5.77617 19.3313 5.95364C19.8846 6.1311 20.3521 6.5081 20.6428 7.01126C20.9335 7.51441 21.0266 8.10772 20.9039 8.67572C20.7813 9.24372 20.4517 9.74577 19.9793 10.0842C19.6717 10.3 19.4206 10.5868 19.2472 10.9202C19.0739 11.2536 18.9833 11.6239 18.9833 11.9997C18.9833 12.3754 19.0739 12.7457 19.2472 13.0791C19.4206 13.4125 19.6717 13.6993 19.9793 13.9152C20.4517 14.2535 20.7813 14.7556 20.9039 15.3236C21.0266 15.8916 20.9335 16.4849 20.6428 16.988C20.3521 17.4912 19.8846 17.8682 19.3313 18.0457C18.778 18.2231 18.1784 18.1884 17.6493 17.9482C17.3085 17.7894 16.9346 17.7151 16.559 17.7315C16.1834 17.7479 15.8174 17.8546 15.4918 18.0425C15.1662 18.2303 14.8906 18.4939 14.6884 18.8108C14.4863 19.1277 14.3634 19.4887 14.3303 19.8632C14.2752 20.4428 14.006 20.9811 13.5752 21.3729C13.1444 21.7646 12.5831 21.9817 12.0008 21.9817C11.4185 21.9817 10.8572 21.7646 10.4264 21.3729C9.99564 20.9811 9.7264 20.4428 9.6713 19.8632C9.63825 19.4886 9.5154 19.1275 9.31317 18.8104C9.11094 18.4934 8.83528 18.2298 8.50954 18.0419C8.1838 17.854 7.81757 17.7474 7.44188 17.7311C7.06619 17.7147 6.69211 17.7892 6.3513 17.9482C5.82219 18.1884 5.22263 18.2231 4.6693 18.0457C4.11598 17.8682 3.64848 17.4912 3.35779 16.988C3.0671 16.4849 2.97402 15.8916 3.09666 15.3236C3.21931 14.7556 3.54891 14.2535 4.0213 13.9152C4.32892 13.6993 4.58003 13.4125 4.75339 13.0791C4.92675 12.7457 5.01726 12.3754 5.01726 11.9997C5.01726 11.6239 4.92675 11.2536 4.75339 10.9202C4.58003 10.5868 4.32892 10.3 4.0213 10.0842C3.54957 9.7456 3.22055 9.24375 3.09821 8.67613C2.97586 8.10852 3.06891 7.51569 3.35929 7.01286C3.64966 6.51004 4.11662 6.13313 4.66939 5.95539C5.22217 5.77766 5.82129 5.81179 6.3503 6.05115C6.69106 6.20989 7.06505 6.28419 7.44061 6.26777C7.81616 6.25135 8.18224 6.1447 8.50784 5.95683C8.83345 5.76896 9.109 5.50541 9.31117 5.18849C9.51334 4.87157 9.63619 4.51061 9.6693 4.13615" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1933_32628">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    ),
    logout: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1933_32656)">
          <path d="M11 20H2" stroke="#8A3030" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M11 4.5622V20.7192C11 20.8711 11.0347 21.021 11.1013 21.1575C11.1679 21.294 11.2648 21.4135 11.3845 21.507C11.5042 21.6005 11.6436 21.6655 11.7922 21.6971C11.9408 21.7287 12.0946 21.726 12.242 21.6892L19 20.0002V5.5622C18.9999 5.11621 18.8508 4.68303 18.5763 4.33153C18.3018 3.98002 17.9177 3.73035 17.485 3.6222L13.485 2.6222C13.1902 2.54852 12.8826 2.54297 12.5854 2.60595C12.2882 2.66894 12.0092 2.79881 11.7697 2.98571C11.5301 3.17261 11.3363 3.41163 11.203 3.68461C11.0696 3.9576 11.0002 4.25838 11 4.5622Z" stroke="#8A3030" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M11 4H8C7.46957 4 6.96086 4.21071 6.58579 4.58579C6.21071 4.96086 6 5.46957 6 6V20" stroke="#8A3030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 12H14.01" stroke="#8A3030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M22 20H19" stroke="#8A3030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_1933_32656">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

    ),

    arrowSide: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={className}
      >
        <g clipPath='url(#clip0_1004_2523)'>
          <path
            d='M6.875 16.25L13.125 10L6.875 3.75'
            stroke='#E7EBEA'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_1004_2523'>
            <rect
              width='20'
              height='20'
              fill='white'
            />
          </clipPath>
        </defs>
      </svg>
    ),


    arrowUp: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g clipPath='url(#clip0_519_3707)'>
          <path
            d='M3.75 13.125L10 6.875L16.25 13.125'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_519_3707'>
            <rect
              width='20'
              height='20'
              fill='white'
            />
          </clipPath>
        </defs>
      </svg>
    ),
    arrowDown: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g clipPath='url(#clip0_68_13)'>
          <path
            d='M3.75 6.875L10 13.125L16.25 6.875'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_68_13'>
            <rect
              width='20'
              height='20'
              fill='white'
            />
          </clipPath>
        </defs>
      </svg>
    ),

  };

  return iconMap[name];
};

export default memo(SidebarIcon);
