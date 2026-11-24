/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * موديول إعدادات المعمل وهوية المنشأة (Lab Settings Component)
 */

window.SettingsComponent = {
  render() {
    const container = document.getElementById("view-settings");
    if (!container) return;

    const lab = window.store.state.labProfile || {};

    container.innerHTML = `
      <div class="card" style="max-width:900px; margin:0 auto;">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="settings"></i>
            <span>إعدادات وهوية المختبر الطبي (Lab Profile & Settings)</span>
          </div>
          <span style="font-size:0.85rem; color:var(--text-muted);">
            تظهر هذه البيانات تلقائياً في ترويسة التقارير الرسمية A4 والإيصالات
          </span>
        </div>

        <form id="lab-settings-form">
          <div class="form-grid">
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">اسم المختبر باللغة العربية *</label>
              <input type="text" id="setting-lab-name-ar" class="form-control" value="${lab.nameAr || ''}" required placeholder="مثال: معمل سيرم للتحاليل الطبية" />
            </div>

            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">اسم المختبر بالإنجليزية (Lab English Name) *</label>
              <input type="text" id="setting-lab-name-en" class="form-control" value="${lab.nameEn || ''}" required placeholder="مثال: Serum Medical Laboratory" />
            </div>

            <div class="form-group">
              <label class="form-label">رقم ترخيص وزارة الصحة (MOH License) *</label>
              <input type="text" id="setting-license" class="form-control" value="${lab.licenseNo || ''}" required placeholder="MOH-EG-2024-XXXX" />
            </div>

            <div class="form-group">
              <label class="form-label">اسم مدير المختبر / الاستشاري المسؤول *</label>
              <input type="text" id="setting-director-name" class="form-control" value="${lab.directorName || ''}" required placeholder="أ.د أحمد المراغي" />
            </div>

            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">اللقب والدرجة العلمية لمدير المختبر *</label>
              <input type="text" id="setting-director-title" class="form-control" value="${lab.directorTitle || ''}" required placeholder="استشاري الباثولوجيا الإكلينيكية والطب المخبري" />
            </div>

            <div class="form-group">
              <label class="form-label">أرقام هواتف المعمل والواتساب *</label>
              <input type="text" id="setting-phone" class="form-control" value="${lab.phone || ''}" required placeholder="010xxxxxxx - 02xxxxxxx" />
            </div>

            <div class="form-group">
              <label class="form-label">البريد الإلكتروني الرسمي للمعمل</label>
              <input type="email" id="setting-email" class="form-control" value="${lab.email || ''}" placeholder="info@lab.com" />
            </div>

            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">العنوان والتفاصيل الجغرافية *</label>
              <input type="text" id="setting-address" class="form-control" value="${lab.address || ''}" required placeholder="المحافظة - المدينة - الشارع - البرج الطبي" />
            </div>

            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">نص التذييل والملاحظة القانونية (تظهر أسفل التقرير A4)</label>
              <textarea id="setting-footer-notice" class="form-control" rows="2" placeholder="النتائج معتمدة إلكترونياً ومطابقة لمعايير الجودة...">${lab.footerNotice || ''}</textarea>
            </div>
          </div>

          <div style="margin-top:24px; display:flex; justify-content:flex-end; gap:12px; border-top:1px solid var(--border-color); padding-top:18px;">
            <button type="submit" class="btn btn-primary btn-lg" style="box-shadow:0 4px 12px var(--primary-glow);">
              <i data-lucide="save"></i>
              <span>حفظ الإعدادات وتحديث كافة الترويسات</span>
            </button>
          </div>
        </form>

        <!-- بطاقة المعاينة الحية (Live Preview Card) -->
        <div id="lab-live-preview" class="card" style="max-width:900px; margin:20px auto 0; border:2px dashed var(--primary); background:var(--bg-tertiary);">
          <div class="card-header" style="border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:16px;">
            <div class="card-title">
              <i data-lucide="eye"></i>
              <span>معاينة حية — ترويسة وتذييل التقرير الطبي الرسمي</span>
            </div>
            <span style="font-size:0.78rem; color:var(--primary); font-weight:700; background:rgba(2,132,199,0.1); padding:3px 10px; border-radius:20px;">
              🔴 تتحدث فورياً أثناء الكتابة قبل الحفظ
            </span>
          </div>

          <!-- محاكاة ترويسة التقرير الطبي -->
          <div style="border:2px solid #0284c7; border-radius:10px; padding:18px; background:#ffffff; color:#0f172a; font-family:'Cairo',sans-serif; direction:rtl;">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #0284c7; padding-bottom:12px; margin-bottom:12px;">
              <div style="display:flex; align-items:center; gap:14px;">
                <div style="width:50px; height:50px; border-radius:12px; overflow:hidden; background:#fff; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center;">
                  <img src="assets/serum-logo.jpg" alt="شعار المعمل" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                  <div style="display:none; width:100%; height:100%; background:linear-gradient(135deg,#0284c7,#0ea5e9); align-items:center; justify-content:center; color:#fff; font-size:22px;">
                    🔬
                  </div>
                </div>
                <div>
                  <div id="preview-lab-name-ar" style="font-size:1.15rem; font-weight:900; color:#0284c7;">${lab.nameAr || 'اسم المختبر بالعربية'}</div>
                  <div id="preview-lab-name-en" style="font-size:0.82rem; color:#334155; font-weight:600;">${lab.nameEn || 'Lab Name in English'}</div>
                  <div id="preview-lab-director" style="font-size:0.75rem; color:#64748b;">مدير المعمل: ${lab.directorName || 'اسم المدير'} — <span id="preview-lab-director-title">${lab.directorTitle || 'الدرجة العلمية'}</span></div>
                </div>
              </div>
              <div style="text-align:left; font-size:0.78rem; color:#475569; border:1px solid #cbd5e1; border-radius:8px; padding:8px 12px; min-width:160px;">
                <div style="margin-bottom:4px;"><strong>📍</strong> <span id="preview-lab-address">${lab.address || 'العنوان'}</span></div>
                <div><strong>📞</strong> <span id="preview-lab-phone">${lab.phone || 'رقم الهاتف'}</span></div>
              </div>
            </div>
            <!-- Sample report body indicator -->
            <div style="background:#f1f5f9; border-radius:6px; padding:10px 14px; font-size:0.78rem; color:#64748b; text-align:center; margin-bottom:12px;">
              [ محتوى التقرير الطبي والنتائج والمعايير المرجعية ]
            </div>
            <!-- Footer -->
            <div style="border-top:2px solid #0284c7; padding-top:10px; display:flex; justify-content:space-between; align-items:center;">
              <div id="preview-lab-footer" style="font-size:0.72rem; color:#64748b; flex:1;">${lab.footerNotice || 'ملاحظة قانونية / تذييل التقرير'}</div>
              <div style="font-size:0.68rem; color:#94a3b8; text-align:left; border-right:1px solid #e2e8f0; padding-right:12px; margin-right:12px;">
                سند لتطوير البرمجيات<br>م/ محمد الدباح
              </div>
            </div>
          </div>
        </div>

        <!-- بطاقة حقوق الملكية الفكرية والجهة المطورة للنظام -->
        <div class="developer-license-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:14px; margin-bottom:14px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:44px; height:44px; border-radius:10px; background:var(--primary); color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 4px 12px var(--primary-glow);">
                <i data-lucide="code-2"></i>
              </div>
              <div>
                <h3 style="margin:0; font-size:1.05rem; font-weight:800; color:var(--text-primary);">
                  سند لتطوير البرمجيات | Sanad Digital 💻
                </h3>
                <div style="font-size:0.8rem; color:var(--primary); font-weight:700; margin-top:2px;">
                  حلول إدارة معامل ومختبرات التحاليل الطبية الذكية
                </div>
              </div>
            </div>

            <div style="background:rgba(16, 185, 129, 0.12); border:1px solid rgba(16, 185, 129, 0.3); border-radius:var(--radius-full); padding:4px 14px; font-size:0.75rem; font-weight:800; color:#10b981; display:flex; align-items:center; gap:6px;">
              <i data-lucide="shield-check" style="width:14px; height:14px;"></i>
              <span>نسخة نظام مرخصة ومحمية برمجياً © 2026</span>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; font-size:0.84rem; background:var(--bg-card); padding:14px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.75rem;">تم التطوير والبرمجة بواسطة:</span>
              <strong style="color:var(--text-primary); font-size:0.92rem;">م/ محمد الدباح</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.75rem;">للدعم الفني والتراخيص:</span>
              <a href="https://wa.me/201501084747" target="_blank" rel="noopener noreferrer" style="color:#10b981; font-weight:800; text-decoration:none; display:inline-flex; align-items:center; gap:4px; font-family:var(--font-mono);">
                <span>01501084747 📲</span>
                <span style="font-size:0.75rem;">(واتساب / اتصال)</span>
              </a>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.75rem;">حقوق الطبع والنشر:</span>
              <span style="font-weight:700; color:var(--text-primary);">جميع الحقوق محفوظة ومسجلة</span>
            </div>
          </div>

          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:10px; line-height:1.5;">
            * هذا النظام محمي بموجب قوانين حماية حقوق الملكية الفكرية وحق المؤلف والجرائم المعلوماتية. يُحظر نسخ أو استغلال الأكواد البرمجية أو التصاميم أو إعادة نشرها دون تصريح خطي رسمي من سند لتطوير البرمجيات.
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    this.initEventListeners();
  },

  initEventListeners() {
    const form = document.getElementById("lab-settings-form");
    if (!form) return;

    // ربط الحقول بالمعاينة الحية (Real-time Live Preview)
    const liveFields = [
      'setting-lab-name-ar', 'setting-lab-name-en',
      'setting-director-name', 'setting-director-title',
      'setting-phone', 'setting-address', 'setting-footer-notice'
    ];
    liveFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          const preview = {
            nameAr: document.getElementById('setting-lab-name-ar').value,
            nameEn: document.getElementById('setting-lab-name-en').value,
            directorName: document.getElementById('setting-director-name').value,
            directorTitle: document.getElementById('setting-director-title').value,
            phone: document.getElementById('setting-phone').value,
            address: document.getElementById('setting-address').value,
            footerNotice: document.getElementById('setting-footer-notice').value,
          };
          if (window.app && typeof window.app.syncLabProfileUI === 'function') {
            window.app.syncLabProfileUI(preview);
          }
        });
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const updatedProfile = {
        nameAr: document.getElementById("setting-lab-name-ar").value.trim(),
        nameEn: document.getElementById("setting-lab-name-en").value.trim(),
        licenseNo: document.getElementById("setting-license").value.trim(),
        directorName: document.getElementById("setting-director-name").value.trim(),
        directorTitle: document.getElementById("setting-director-title").value.trim(),
        phone: document.getElementById("setting-phone").value.trim(),
        email: document.getElementById("setting-email").value.trim(),
        address: document.getElementById("setting-address").value.trim(),
        footerNotice: document.getElementById("setting-footer-notice").value.trim()
      };

      // حفظ الإعدادات في المتجر المركزي (يُطلق notify تلقائياً → يُحدّث كل الواجهة)
      window.store.updateLabProfile(updatedProfile);

      window.app.showToast("✅ تم حفظ إعدادات المختبر وتحديث كافة التقارير والواجهات فورياً", "success");
    });
  }
};
