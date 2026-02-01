import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';

/**
 * Typed dispatch hook for use with Redux
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
