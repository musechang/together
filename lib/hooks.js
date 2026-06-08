/* ══════════════════════════════════════════
   lib/hooks.js — Custom React hooks
══════════════════════════════════════════ */
import { useState, useEffect, useCallback } from 'react';
import { searchStore, authStore, favStore, reviewStore } from './store';

export function useSearch() {
  const [state, setState] = useState(searchStore.get());
  useEffect(() => searchStore.subscribe(setState), []);
  const update = useCallback((patch) => searchStore.set(patch), []);
  return [state, update];
}

export function useAuth() {
  const [user, setUser] = useState(authStore.get());
  useEffect(() => {
    authStore.restore();
    return authStore.subscribe(setUser);
  }, []);
  return { user, login: authStore.login, logout: authStore.logout };
}

export function useFavourites() {
  const [favs, setFavs] = useState(favStore.getAll());
  useEffect(() => {
    favStore.restore();
    return favStore.subscribe(setFavs);
  }, []);
  return { favs, toggle: favStore.toggle, has: favStore.has };
}

export function useReviews(hotelId) {
  const [reviews, setReviews] = useState(
    hotelId ? reviewStore.getByHotel(hotelId) : reviewStore.getAll()
  );
  useEffect(() => {
    reviewStore.restore();
    return reviewStore.subscribe(all =>
      setReviews(hotelId ? all.filter(r => r.hotelId === hotelId) : all)
    );
  }, [hotelId]);
  return { reviews, addReview: reviewStore.add };
}

/** Read-only search params formatted for display */
export function useSearchDisplay() {
  const [s] = useSearch();
  const fmt = (d) => d ? `${d.getMonth()+1}/${d.getDate()}` : '';
  return {
    locLabel: s.loc || '搜尋目的地',
    dateLabel: s.checkin
      ? `${fmt(s.checkin)}${s.checkout ? ' → ' + fmt(s.checkout) : ''}`
      : '選擇日期',
    guestLabel: s.adults
      ? `${s.adults}人，${s.dogs}隻狗${s.dogSizes.length ? `（${s.dogSizes.join('、')}型）` : ''}`
      : '新增數量',
  };
}
