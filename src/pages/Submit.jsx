import React, { useState, useRef } from 'react';
import { createPaper } from '../api/research'; 
import styles from '../styling/Submit.module.css';

const Submit = () => {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [file, setFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // إدارة الكلمات المفتاحية
  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const trimmed = keywordInput.trim();
      if (trimmed && !keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
        setKeywordInput('');
      }
    }
  };

  const handleRemoveKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  // معالجة اختيار الملف
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // إرسال البيانات للباك إند
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !abstract || !file) {
      setError('الرجاء تعبئة الحقول الأساسية ورفع ملف البحث.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('file', file);
    formData.append('keywords', keywords.join(','));

    try {
      const response = await createPaper(formData);
      setSuccessRef(response.reference_id || response.id || 'ASPU-' + Math.floor(Math.random() * 90000 + 10000));
      setShowSuccess(true);
      handleReset();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال البحث، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setAbstract(''); // تصحيح: كانت abstract('') وهاد غلط
    setKeywords([]);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={styles.pageContainer} dir="rtl">
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>ASPU Insight — نشر بحث جديد</h2>
        <p className={styles.formSubtitle}>قم بتعبئة بيانات البحث ورفع الملف بصيغة PDF ليتم مراجعته من قبل النظام والمحررين.</p>
        
        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.mainForm}>
          
          {/* قسم البيانات الأساسية */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>1. تفاصيل البحث</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="title">عنوان البحث <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                id="title"
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنوان البحث كاملاً..."
                required
              />
              <span className={styles.charCount}>{title.length}/150</span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="abstract">الخلاصة (Abstract) <span className={styles.required}>*</span></label>
              <textarea 
                id="abstract"
                maxLength={1000}
                rows={6}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="اكتب خلاصة البحث هنا..."
                required
              />
              <span className={styles.charCount}>{abstract.length}/1000</span>
            </div>
          </div>

          {/* قسم الكلمات المفتاحية */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>2. الكلمات المفتاحية</h3>
            <div className={styles.keywordWrapper}>
              <input 
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                placeholder="أضف كلمة واضغط Enter..."
              />
              <button type="button" onClick={handleAddKeyword} className={styles.addBtn}>إضافة</button>
            </div>
            
            <div className={styles.tagsContainer}>
              {keywords.map((kw, idx) => (
                <span key={idx} className={styles.tag}>
                  {kw}
                  <button type="button" onClick={() => handleRemoveKeyword(idx)}>&times;</button>
                </span>
              ))}
            </div>
          </div>

          {/* قسم رفع الملف */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>3. ملف البحث</h3>
            <div className={styles.fileUploadZone}>
              <input 
                type="file" 
                id="file-upload" 
                accept=".pdf" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.hiddenFileInput}
                required
              />
              <label htmlFor="file-upload" className={styles.fileLabel}>
                <div className={styles.uploadIcon}>📁</div>
                {file ? (
                  <span className={styles.fileName}>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                ) : (
                  <span>اسحب ملف البحث بصيغة PDF أو انقر للاختيار</span>
                )}
              </label>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className={styles.actionRow}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'جاري الإرسال...' : 'تقديم البحث للمراجعة'}
            </button>
            <button type="button" onClick={handleReset} className={styles.resetBtn} disabled={loading}>
              إعادة تعيين
            </button>
          </div>

        </form>
      </div>

      {/* شاشة النجاح المنبثقة (Overlay) */}
      {showSuccess && (
        <div className={styles.overlay}>
          <div className={styles.overlayCard}>
            <div className={styles.successCheck}>✓</div>
            <h3>تم تقديم البحث بنجاح!</h3>
            <p>تم تسجيل البحث في نظام ASPU Insight بنجاح وجاري تحويله إلى نظام مراجعة الذكاء الاصطناعي.</p>
            <div className={styles.refBox}>رقم المرجع: {successRef}</div>
            <button onClick={() => setShowSuccess(false)} className={styles.closeOverlayBtn}>موافق</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submit; // عملنا export لنفس اسم الكومبوننت فوق