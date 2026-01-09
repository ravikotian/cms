import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useAppContext } from '../../../context';
import { SET_SITE_SETTINGS } from '../../../context/actionTypes';
import { db } from '../../../firebase-config';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import './SiteSettings.css';

const SiteSettings = () => {
  const { state: { siteSettings = {} }, dispatch } = useAppContext();

  const [siteName, setSiteName] = useState(siteSettings.siteName || 'Easy Consulting');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(siteSettings.siteLogo || '');
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(siteSettings.favicon || '');
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    const snap = await getDocs(collection(db, 'settings'));
    const map = {};
    snap.docs.forEach(d => {
      const data = d.data();
      map[d.id] = data.value !== undefined ? data.value : data;
    });
    dispatch({ type: SET_SITE_SETTINGS, payload: map });
    // update local previews
    setSiteName(map.siteName || siteName);
    setLogoPreview(map.siteLogo || '');
    setFaviconPreview(map.favicon || '');
    // apply immediately
    if (map.siteName) document.title = map.siteName;
    if (map.favicon) updateFavicon(map.favicon);
  }

  useEffect(() => { loadSettings(); /* eslint-disable-next-line */ }, []);

  // sync previews from context whenever siteSettings updates
  useEffect(() => {
    if (siteSettings.siteLogo) setLogoPreview(siteSettings.siteLogo);
    if (siteSettings.favicon) setFaviconPreview(siteSettings.favicon);
    if (siteSettings.siteName) setSiteName(siteSettings.siteName);
  }, [siteSettings]);

  const handleLogoFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  }

  const handleFaviconFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFaviconFile(f);
    setFaviconPreview(URL.createObjectURL(f));
  }

  const updateFavicon = (url) => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = url;
  }

  const saveImageSetting = async (key, file) => {
    if (!file) return null;
    // convert file to base64 string
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64 = reader.result; // data:image/png;base64,...
          await setDoc(doc(db, 'settings', key), { value: base64, type: 'image' });
          resolve(base64);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  const saveTextSetting = async (key, text) => {
    await setDoc(doc(db, 'settings', key), { value: text, type: 'text' });
    return text;
  }

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updates = {};
      // save siteName
      if (siteName !== (siteSettings.siteName || '')) {
        const v = await saveTextSetting('siteName', siteName);
        updates.siteName = v;
        document.title = v;
      }
      // save logo
      if (logoFile) {
        const url = await saveImageSetting('siteLogo', logoFile);
        updates.siteLogo = url;
      }
      // save favicon
      if (faviconFile) {
        const url = await saveImageSetting('favicon', faviconFile);
        updates.favicon = url;
        updateFavicon(url);
      }
      if (Object.keys(updates).length > 0) {
        // refresh map from DB
        const snap = await getDocs(collection(db, 'settings'));
        const map = {};
        snap.docs.forEach(d => { const data = d.data(); map[d.id] = data.value !== undefined ? data.value : data; });
        dispatch({ type: SET_SITE_SETTINGS, payload: map });
        toast.success('Settings updated');
        setLogoFile(null); setFaviconFile(null);
      } else {
        toast('No changes to save');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    }
    setSaving(false);
  }

  return (
    <div className="site-settings">
      <h4>Site Settings</h4>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Site Name</Form.Label>
              <Form.Control value={siteName} onChange={e => setSiteName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Site Logo</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleLogoFile} />
              {logoPreview && <div className="preview mt-2"><img src={logoPreview} alt="logo preview" style={{height:60}}/></div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Favicon</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFaviconFile} />
              {faviconPreview && <div className="preview mt-2"><img src={faviconPreview} alt="favicon preview" style={{height:32}}/></div>}
            </Form.Group>

            <div>
              <Button onClick={handleSaveAll} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default SiteSettings;
