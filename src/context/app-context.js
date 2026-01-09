import { useReducer, useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { getDecodedUser } from "../component/Login/LoginManager";
import { reducer } from "./reducer";
import { SET_SITE_SETTINGS } from './actionTypes';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const AppContext = createContext();

const initialState = {
  user: getDecodedUser(),
  admin: false,
  selectedService: {},
  siteSettings: {},
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'settings'));
        const map = {};
        snapshot.docs.forEach(d => {
          const data = d.data();
          // prefer explicit value field, fall back to whole doc
          map[d.id] = data.value !== undefined ? data.value : data;
        });
        // normalize legacy / nested site doc formats into flat keys
        const normalized = { ...map };
        // if there is a `site` doc that contains nested fields, flatten them
        if (map.site && typeof map.site === 'object') {
          const site = map.site;
          if (site.logoUrl) normalized.siteLogo = site.logoUrl;
          if (site.siteLogo) normalized.siteLogo = site.siteLogo;
          if (site.siteTitle) normalized.siteName = site.siteTitle;
          if (site.siteName) normalized.siteName = site.siteName;
          if (site.favicon) normalized.favicon = site.favicon;
        }
        // fallback keys from older naming
        if (!normalized.siteLogo && (map.logoUrl || map.logo)) {
          normalized.siteLogo = map.logoUrl || map.logo;
        }
        if (!normalized.siteName && (map.siteTitle || map.title)) {
          normalized.siteName = map.siteTitle || map.title;
        }

        console.log('Loaded settings from Firestore:', map);
        console.log('Normalized settings:', normalized);
        dispatch({ type: SET_SITE_SETTINGS, payload: normalized });
        // apply site title and favicon immediately
        if (normalized.siteName) document.title = normalized.siteName;
        if (normalized.favicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = normalized.favicon;
        }
      } catch (err) {
        console.error('Failed to load site settings', err);
      }
    };
    loadSettings();
  }, [dispatch]);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
