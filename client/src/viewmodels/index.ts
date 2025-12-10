import { AuthViewModel } from './AuthViewModel';
import { BookingViewModel } from './BookingViewModel';
import { MapViewModel } from './MapViewModel';
import { UserProfileViewModel } from './UserProfileViewModel';
import { AdminViewModel } from './AdminViewModel';

export const authViewModel = new AuthViewModel();
export const adminViewModel = new AdminViewModel();
export const userProfileViewModel = new UserProfileViewModel();

// Export classes as well for testing or specific use cases
export { AuthViewModel, BookingViewModel, MapViewModel, UserProfileViewModel, AdminViewModel };
