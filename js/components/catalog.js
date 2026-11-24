/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * موديول دليل التحاليل والباقات والمعدلات الطبيعية (Catalog Component)
 */

window.CatalogComponent = {
  activeTab: "tests", // 'tests' | 'packages'

  render() {
    const container = document.getElementById("view-catalog");
    if (!container) return;

    const tests = window.store.state.tests;
    const packages = window.store.state.packages;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="flask-conical"></i>
            <span>دليل التحاليل المخبرية والباقات الطبية</span>
          </div>

          <div style="display:flex; gap:10px;">
            <button id="btn-add-test-modal" class="btn btn-primary btn-sm">
              <i data-lucide="plus"></i>
              <span>إضافة تحليل جديد</span>
            </button>
            <button id="btn-add-package-modal" class="btn btn-outline btn-sm">
              <i data-lucide="package-plus"></i>
              <span>إنشاء باقة تحاليل (عرض)</span>
            </button>
          </div>
        </div>

        <!-- ألسنة التبويب والبحث -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; gap:8px;">
            <button class="btn btn-sm ${this.activeTab === 'tests' ? 'btn-primary' : 'btn-outline'}" id="tab-btn-tests">
              <i data-lucide="list"></i>
              <span>التحاليل الفردية (${tests.length})</span>
            </button>
            <button class="btn btn-sm ${this.activeTab === 'packages' ? 'btn-primary' : 'btn-outline'}" id="tab-btn-packages">
              <i data-lucide="boxes"></i>
              <span>باقات الفحص المخبري (${packages.length})</span>
            </button>
          </div>

          <div style="min-width:280px;">
            <input type="text" id="catalog-filter-input" class="form-control" placeholder="تصفية حسب الاسم، الكود، أو القسم..." />
          </div>
        </div>

        <!-- محتوى تبويب التحاليل الفردية -->
        <div id="tab-content-tests" style="display: ${this.activeTab === 'tests' ? 'block' : 'none'};">
          <div class="table-responsive">
            <table class="data-table" id="catalog-table">
              <thead>
                <tr>
                  <th>كود الفحص</th>
                  <th>اسم التحليل بالعربية</th>
                  <th>الاسم بالإنجليزية (Test Name)</th>
                  <th>القسم المخبري</th>
                  <th>السعر</th>
                  <th>البارامترات والمدى الطبيعي</th>
                  <th style="text-align:center;">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${tests.map(t => {
                  const paramCount = t.parameters ? t.parameters.length : 1;
                  const firstParam = t.parameters && t.parameters[0];
                  const rangePreview = firstParam 
                    ? window.LabValidator.formatRange(firstParam.min, firstParam.max, firstParam.unit)
                    : "حسب المرجع";

                  return `
                    <tr class="catalog-item-row" data-search="${t.code.toLowerCase()} ${t.nameAr.toLowerCase()} ${t.nameEn.toLowerCase()} ${t.category.toLowerCase()}">
                      <td>
                        <strong style="font-family:var(--font-mono); color:var(--primary); font-size:1rem;">${t.code}</strong>
                      </td>
                      <td>
                        <strong>${t.nameAr}</strong>
                        ${t.tube ? `<div style="font-size:0.75rem; color:var(--primary); margin-top:2px;">🧪 ${t.tube}</div>` : ''}
                      </td>
                      <td style="color:var(--text-secondary);">${t.nameEn}</td>
                      <td><span class="badge badge-info">${t.category}</span></td>
                      <td><strong style="color:var(--success-text);">${t.price} ج.م</strong></td>
                      <td>
                        <span style="font-size:0.85rem;">
                          ${paramCount > 1 ? `(${paramCount} متغيرات) مثال: ` : ''}
                          <code>${rangePreview}</code>
                        </span>
                      </td>
                      <td style="text-align:center;">
                        <div style="display:inline-flex; gap:6px; align-items:center;">
                          <button class="action-icon-btn btn-edit-test" data-id="${t.id}" title="تعديل التحليل" style="display:inline-flex; width:32px; height:32px; color:var(--primary);">
                            <i data-lucide="edit-3" style="width:15px;height:15px;"></i>
                          </button>
                          <button class="action-icon-btn btn-delete-test" data-id="${t.id}" title="حذف التحليل" style="display:inline-flex; width:32px; height:32px; color:var(--danger);">
                            <i data-lucide="trash-2" style="width:15px;height:15px;"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- محتوى تبويب الباقات -->
        <div id="tab-content-packages" style="display: ${this.activeTab === 'packages' ? 'block' : 'none'};">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:18px;">
            ${packages.map(pkg => {
              const testNames = pkg.testIds.map(tId => {
                const t = tests.find(item => item.id === tId);
                return t ? t.nameAr : tId;
              });

              return `
                <div class="card" style="margin-bottom:0; border:1px solid var(--border-color); background-color:var(--bg-tertiary);">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <div>
                      <h4 style="font-weight:800; color:var(--primary); margin:0;">${pkg.nameAr}</h4>
                      <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">${pkg.nameEn}</div>
                    </div>
                    <span class="badge badge-success" style="font-size:0.95rem; font-weight:800;">${pkg.price} ج.م</span>
                  </div>
                  
                  <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px; min-height:36px;">${pkg.description || 'باقة شاملة مجمعة'}</p>
                  
                  <div style="font-size:0.82rem; border-top:1px dashed var(--border-color); padding-top:10px; margin-bottom:14px;">
                    <strong style="display:block; margin-bottom:6px;">التحاليل المشمولة (${pkg.testIds.length}):</strong>
                    <div style="display:flex; flex-wrap:wrap; gap:4px; max-height:85px; overflow-y:auto;">
                      ${testNames.map(name => `
                        <span class="badge badge-info" style="font-size:0.75rem;">${name}</span>
                      `).join("")}
                    </div>
                  </div>

                  <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid var(--border-color); padding-top:10px;">
                    <button class="btn btn-outline btn-sm btn-edit-package" data-id="${pkg.id}" title="تعديل الباقة" style="padding:4px 10px; font-size:0.78rem;">
                      <i data-lucide="edit-3" style="width:13px;height:13px;"></i>
                      <span>تعديل</span>
                    </button>
                    <button class="btn btn-outline btn-sm btn-delete-package" data-id="${pkg.id}" title="حذف الباقة" style="padding:4px 10px; font-size:0.78rem; color:var(--danger); border-color:rgba(239, 68, 68, 0.3);">
                      <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    this.initEventListeners();
  },

  initEventListeners() {
    const container = document.getElementById("view-catalog");
    if (!container) return;

    // تبديل التبويبات
    document.getElementById("tab-btn-tests").addEventListener("click", () => {
      this.activeTab = "tests";
      this.render();
    });

    document.getElementById("tab-btn-packages").addEventListener("click", () => {
      this.activeTab = "packages";
      this.render();
    });

    // تصفية الجدول
    const filterInput = document.getElementById("catalog-filter-input");
    filterInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      container.querySelectorAll(".catalog-item-row").forEach(row => {
        const text = row.getAttribute("data-search");
        row.style.display = text.includes(term) ? "" : "none";
      });
    });

    // فتح نافذة إضافة تحليل جديد
    document.getElementById("btn-add-test-modal").addEventListener("click", () => {
      this.showAddTestModal();
    });

    // فتح نافذة إنشاء باقة
    document.getElementById("btn-add-package-modal").addEventListener("click", () => {
      this.showAddPackageModal();
    });

    // تعديل تحليل
    container.querySelectorAll(".btn-edit-test").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.showEditTestModal(id);
      });
    });

    // حذف تحليل
    container.querySelectorAll(".btn-delete-test").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm("هل أنت متأكد من حذف هذا التحليل من الدليل؟")) {
          window.store.deleteTest(id);
          window.app.showToast("تم حذف التحليل بنجاح", "success");
          this.render();
        }
      });
    });

    // تعديل باقة
    container.querySelectorAll(".btn-edit-package").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.showEditPackageModal(id);
      });
    });

    // حذف باقة
    container.querySelectorAll(".btn-delete-package").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm("هل أنت متأكد من حذف هذه الباقة من العروض؟")) {
          window.store.deletePackage(id);
          window.app.showToast("تم حذف الباقة بنجاح", "success");
          this.render();
        }
      });
    });
  },

  showAddTestModal() {
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `<i data-lucide="plus-circle" style="color:var(--primary);"></i> إضافة فحص طبي جديد لدليل المختبر`;

    modalBody.innerHTML = `
      <form id="form-new-test">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">كود التحليل المختصر *</label>
            <input type="text" id="new-test-code" class="form-control" placeholder="مثال: CRP, ESR, UREA" required />
          </div>

          <div class="form-group">
            <label class="form-label">الاسم باللغة العربية *</label>
            <input type="text" id="new-test-name-ar" class="form-control" placeholder="مثال: سرعة الترسيب" required />
          </div>

          <div class="form-group">
            <label class="form-label">الاسم بالإنجليزية (Test Name) *</label>
            <input type="text" id="new-test-name-en" class="form-control" placeholder="مثال: Erythrocyte Sedimentation Rate" required />
          </div>

          <div class="form-group">
            <label class="form-label">القسم المخبري *</label>
            <select id="new-test-category" class="form-control" required>
              <option value="أمراض الدم (Hematology)">أمراض الدم (Hematology)</option>
              <option value="السكري والتمثيل الغذائي (Diabetes)">السكري والتمثيل الغذائي (Diabetes)</option>
              <option value="وظائف الكبد والإنزيمات (Hepatic)">وظائف الكبد والإنزيمات (Hepatic)</option>
              <option value="وظائف الكلى والأملاح (Renal)">وظائف الكلى والأملاح (Renal)</option>
              <option value="الدهون وصحة القلب (Lipids)">الدهون وصحة القلب (Lipids)</option>
              <option value="الهرمونات والغدد (Endocrinology)">الهرمونات والغدد (Endocrinology)</option>
              <option value="المناعة والأمصال (Serology)">المناعة والأمصال (Serology)</option>
              <option value="المايكروبيولوجي والبول والبراز">المايكروبيولوجي والبول والبراز</option>
              <option value="الفيروسات والمناعة (Virology)">الفيروسات والمناعة (Virology)</option>
              <option value="البيولوجيا الجزيئية (Molecular / PCR)">البيولوجيا الجزيئية (Molecular / PCR)</option>
              <option value="السموم والمخدرات (Toxicology)">السموم والمخدرات (Toxicology)</option>
              <option value="كيمياء الدم العامة (Clinical Chemistry)">كيمياء الدم العامة (Clinical Chemistry)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">سعر التحليل (ج.م) *</label>
            <input type="number" id="new-test-price" class="form-control" min="0" placeholder="مثال: 90" required />
          </div>

          <div class="form-group">
            <label class="form-label">أنبوبة السحب ونوع العينة</label>
            <input type="text" id="new-test-tube" class="form-control" placeholder="مثال: EDTA (أنبوبة بنفسجي) أو Serum (صفراء جل)" />
          </div>

          <div class="form-group">
            <label class="form-label">وحدة القياس (Unit)</label>
            <input type="text" id="new-test-unit" class="form-control" placeholder="مثال: mg/dL, mm/hr, U/L" />
          </div>

          <div class="form-group">
            <label class="form-label">الحد الأدنى للمدى الطبيعي (Min)</label>
            <input type="number" step="any" id="new-test-min" class="form-control" placeholder="مثال: 0" />
          </div>

          <div class="form-group">
            <label class="form-label">الحد الأقصى للمدى الطبيعي (Max)</label>
            <input type="number" step="any" id="new-test-max" class="form-control" placeholder="مثال: 20" />
          </div>
        </div>
      </form>
    `;

    modalFooter.innerHTML = `
      <button type="button" id="btn-save-test" class="btn btn-primary btn-sm">
        <i data-lucide="check"></i>
        <span>حفظ التحليل في الدليل</span>
      </button>
      <button type="button" id="btn-cancel-modal" class="btn btn-outline btn-sm">إلغاء</button>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.app.openModal();

    document.getElementById("btn-cancel-modal").addEventListener("click", () => window.app.closeModal());

    document.getElementById("btn-save-test").addEventListener("click", () => {
      const code = document.getElementById("new-test-code").value.trim();
      const nameAr = document.getElementById("new-test-name-ar").value.trim();
      const nameEn = document.getElementById("new-test-name-en").value.trim();
      const category = document.getElementById("new-test-category").value;
      const price = parseFloat(document.getElementById("new-test-price").value) || 0;
      const tube = document.getElementById("new-test-tube").value.trim();
      const unit = document.getElementById("new-test-unit").value.trim();
      const min = document.getElementById("new-test-min").value;
      const max = document.getElementById("new-test-max").value;

      if (!code || !nameAr) {
        window.app.showToast("يرجى ملء الحقول الإلزامية المطلوبة", "error");
        return;
      }

      window.store.addTest({
        code,
        nameAr,
        nameEn: nameEn || code,
        category,
        price,
        tube: tube || "Serum Clot Activator (أنبوبة صفراء جل)",
        parameters: [
          {
            key: code.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name: nameEn || nameAr,
            unit: unit || '',
            min: min !== '' ? parseFloat(min) : undefined,
            max: max !== '' ? parseFloat(max) : undefined,
            precision: 1
          }
        ]
      });

      window.app.showToast(`تمت إضافة التحليل (${code}) بنجاح إلى الدليل`, "success");
      window.app.closeModal();
      this.render();
    });
  },

  showEditTestModal(testId) {
    const test = (window.store.state.tests || []).find(t => t.id === testId);
    if (!test) return;

    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `<i data-lucide="edit-3" style="color:var(--primary);"></i> تعديل بيانات التحليل: ${test.nameAr} (${test.code})`;

    const firstParam = (test.parameters && test.parameters[0]) || {};

    modalBody.innerHTML = `
      <form id="form-edit-test">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">كود التحليل المختصر *</label>
            <input type="text" id="edit-test-code" class="form-control" value="${test.code}" required />
          </div>

          <div class="form-group">
            <label class="form-label">الاسم باللغة العربية *</label>
            <input type="text" id="edit-test-name-ar" class="form-control" value="${test.nameAr}" required />
          </div>

          <div class="form-group">
            <label class="form-label">الاسم بالإنجليزية (Test Name) *</label>
            <input type="text" id="edit-test-name-en" class="form-control" value="${test.nameEn || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">القسم المخبري *</label>
            <select id="edit-test-category" class="form-control" required>
              <option value="أمراض الدم (Hematology)" ${test.category.includes('الدم') ? 'selected' : ''}>أمراض الدم (Hematology)</option>
              <option value="السكري والتمثيل الغذائي (Diabetes)" ${test.category.includes('السكري') ? 'selected' : ''}>السكري والتمثيل الغذائي (Diabetes)</option>
              <option value="وظائف الكبد والإنزيمات (Hepatic)" ${test.category.includes('الكبد') ? 'selected' : ''}>وظائف الكبد والإنزيمات (Hepatic)</option>
              <option value="وظائف الكلى والأملاح (Renal)" ${test.category.includes('الكلى') ? 'selected' : ''}>وظائف الكلى والأملاح (Renal)</option>
              <option value="الدهون وصحة القلب (Lipids)" ${test.category.includes('الدهون') ? 'selected' : ''}>الدهون وصحة القلب (Lipids)</option>
              <option value="الهرمونات والغدد (Endocrinology)" ${test.category.includes('الهرمونات') ? 'selected' : ''}>الهرمونات والغدد (Endocrinology)</option>
              <option value="المناعة والأمصال (Serology)" ${test.category.includes('المناعة') ? 'selected' : ''}>المناعة والأمصال (Serology)</option>
              <option value="المايكروبيولوجي والبول والبراز" ${test.category.includes('المايكرو') || test.category.includes('البول') ? 'selected' : ''}>المايكروبيولوجي والبول والبراز</option>
              <option value="الفيروسات والمناعة (Virology)" ${test.category.includes('الفيروسات') ? 'selected' : ''}>الفيروسات والمناعة (Virology)</option>
              <option value="البيولوجيا الجزيئية (Molecular / PCR)" ${test.category.includes('PCR') ? 'selected' : ''}>البيولوجيا الجزيئية (Molecular / PCR)</option>
              <option value="السموم والمخدرات (Toxicology)" ${test.category.includes('مخدرات') || test.category.includes('السموم') ? 'selected' : ''}>السموم والمخدرات (Toxicology)</option>
              <option value="كيمياء الدم العامة (Clinical Chemistry)" ${test.category.includes('كيمياء') ? 'selected' : ''}>كيمياء الدم العامة (Clinical Chemistry)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">سعر التحليل (ج.م) *</label>
            <input type="number" id="edit-test-price" class="form-control" min="0" value="${test.price}" required />
          </div>

          <div class="form-group">
            <label class="form-label">أنبوبة السحب ونوع العينة</label>
            <input type="text" id="edit-test-tube" class="form-control" value="${test.tube || ''}" placeholder="مثال: EDTA (أنبوبة بنفسجي) أو Serum (صفراء جل)" />
          </div>

          <div class="form-group">
            <label class="form-label">وحدة القياس (Unit)</label>
            <input type="text" id="edit-test-unit" class="form-control" value="${firstParam.unit || ''}" placeholder="مثال: mg/dL, U/L, ng/mL" />
          </div>

          <div class="form-group">
            <label class="form-label">الحد الأدنى للمدى الطبيعي (Min)</label>
            <input type="number" step="any" id="edit-test-min" class="form-control" value="${firstParam.min !== undefined ? firstParam.min : ''}" />
          </div>

          <div class="form-group">
            <label class="form-label">الحد الأقصى للمدى الطبيعي (Max)</label>
            <input type="number" step="any" id="edit-test-max" class="form-control" value="${firstParam.max !== undefined ? firstParam.max : ''}" />
          </div>
        </div>
      </form>
    `;

    modalFooter.innerHTML = `
      <button type="button" id="btn-update-test" class="btn btn-primary btn-sm">
        <i data-lucide="check"></i>
        <span>حفظ التعديلات</span>
      </button>
      <button type="button" id="btn-cancel-edit-modal" class="btn btn-outline btn-sm">إلغاء</button>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.app.openModal();

    document.getElementById("btn-cancel-edit-modal").addEventListener("click", () => window.app.closeModal());

    document.getElementById("btn-update-test").addEventListener("click", () => {
      const code = document.getElementById("edit-test-code").value.trim();
      const nameAr = document.getElementById("edit-test-name-ar").value.trim();
      const nameEn = document.getElementById("edit-test-name-en").value.trim();
      const category = document.getElementById("edit-test-category").value;
      const price = parseFloat(document.getElementById("edit-test-price").value) || 0;
      const tube = document.getElementById("edit-test-tube").value.trim();
      const unit = document.getElementById("edit-test-unit").value.trim();
      const min = document.getElementById("edit-test-min").value;
      const max = document.getElementById("edit-test-max").value;

      if (!code || !nameAr) {
        window.app.showToast("يرجى ملء الحقول الإلزامية المطلوبة", "error");
        return;
      }

      const parameters = test.parameters && test.parameters.length > 0 ? [...test.parameters] : [];
      if (parameters.length > 0) {
        parameters[0].unit = unit;
        if (min !== '') parameters[0].min = parseFloat(min);
        if (max !== '') parameters[0].max = parseFloat(max);
      } else {
        parameters.push({
          key: code.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          name: nameEn || nameAr,
          unit,
          min: min !== '' ? parseFloat(min) : undefined,
          max: max !== '' ? parseFloat(max) : undefined,
          precision: 1
        });
      }

      window.store.updateTest(testId, {
        code,
        nameAr,
        nameEn,
        category,
        price,
        tube,
        parameters
      });

      window.app.showToast(`تم تعديل التحليل (${code}) بنجاح وتحديث أسعاره في المنظومة`, "success");
      window.app.closeModal();
      this.render();
    });
  },

  showAddPackageModal() {
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `<i data-lucide="package-plus" style="color:var(--primary);"></i> إنشاء باقة تحاليل مجمعة (عرض مخبري)`;

    const tests = window.store.state.tests;

    modalBody.innerHTML = `
      <form id="form-new-pkg">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">اسم الباقة بالعربية *</label>
            <input type="text" id="new-pkg-name-ar" class="form-control" placeholder="مثال: باقة فحص ما قبل الزواج" required />
          </div>

          <div class="form-group">
            <label class="form-label">اسم الباقة بالإنجليزية</label>
            <input type="text" id="new-pkg-name-en" class="form-control" placeholder="مثال: Pre-Marital Screening Package" />
          </div>

          <div class="form-group">
            <label class="form-label">سعر الباقة الموحد (ج.م) *</label>
            <input type="number" id="new-pkg-price" class="form-control" min="0" placeholder="مثال: 350" required />
          </div>

          <div class="form-group">
            <label class="form-label">وصف الباقة</label>
            <input type="text" id="new-pkg-desc" class="form-control" placeholder="وصف موجز لمحتويات العرض" />
          </div>
        </div>

        <div style="margin-top:14px;">
          <label class="form-label" style="display:block; margin-bottom:8px;">اختر التحاليل المشمولة في الباقة:</label>
          <div style="max-height:220px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:6px;">
            ${tests.map(t => `
              <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; cursor:pointer;">
                <input type="checkbox" name="pkg-test-select" value="${t.id}" />
                <span><strong>${t.code}</strong> - ${t.nameAr} (${t.price} ج.م)</span>
              </label>
            `).join("")}
          </div>
        </div>
      </form>
    `;

    modalFooter.innerHTML = `
      <button type="button" id="btn-save-pkg" class="btn btn-primary btn-sm">
        <i data-lucide="check"></i>
        <span>إنشاء الباقة</span>
      </button>
      <button type="button" id="btn-cancel-pkg-modal" class="btn btn-outline btn-sm">إلغاء</button>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.app.openModal();

    document.getElementById("btn-cancel-pkg-modal").addEventListener("click", () => window.app.closeModal());

    document.getElementById("btn-save-pkg").addEventListener("click", () => {
      const nameAr = document.getElementById("new-pkg-name-ar").value.trim();
      const nameEn = document.getElementById("new-pkg-name-en").value.trim();
      const price = parseFloat(document.getElementById("new-pkg-price").value) || 0;
      const description = document.getElementById("new-pkg-desc").value.trim();

      const checkedTests = Array.from(document.querySelectorAll('input[name="pkg-test-select"]:checked')).map(cb => cb.value);

      if (!nameAr || checkedTests.length === 0) {
        window.app.showToast("يرجى إدخال اسم الباقة والسعر واختيار تحليل واحد على الأقل", "error");
        return;
      }

      window.store.addPackage({
        nameAr,
        nameEn: nameEn || nameAr,
        price,
        description,
        testIds: checkedTests
      });

      window.app.showToast("تم إنشاء الباقة بنجاح", "success");
      window.app.closeModal();
      this.activeTab = "packages";
      this.render();
    });
  },

  showEditPackageModal(pkgId) {
    const pkg = (window.store.state.packages || []).find(p => p.id === pkgId);
    if (!pkg) return;

    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `<i data-lucide="edit-3" style="color:var(--primary);"></i> تعديل باقة: ${pkg.nameAr}`;

    const tests = window.store.state.tests;

    modalBody.innerHTML = `
      <form id="form-edit-pkg">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">اسم الباقة بالعربية *</label>
            <input type="text" id="edit-pkg-name-ar" class="form-control" value="${pkg.nameAr}" required />
          </div>

          <div class="form-group">
            <label class="form-label">اسم الباقة بالإنجليزية</label>
            <input type="text" id="edit-pkg-name-en" class="form-control" value="${pkg.nameEn || ''}" />
          </div>

          <div class="form-group">
            <label class="form-label">سعر الباقة الموحد (ج.م) *</label>
            <input type="number" id="edit-pkg-price" class="form-control" min="0" value="${pkg.price}" required />
          </div>

          <div class="form-group">
            <label class="form-label">وصف الباقة</label>
            <input type="text" id="edit-pkg-desc" class="form-control" value="${pkg.description || ''}" />
          </div>
        </div>

        <div style="margin-top:14px;">
          <label class="form-label" style="display:block; margin-bottom:8px;">اختر التحاليل المشمولة في الباقة:</label>
          <div style="max-height:220px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:6px;">
            ${tests.map(t => {
              const isChecked = (pkg.testIds || []).includes(t.id);
              return `
                <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" name="edit-pkg-test-select" value="${t.id}" ${isChecked ? 'checked' : ''} />
                  <span><strong>${t.code}</strong> - ${t.nameAr} (${t.price} ج.م)</span>
                </label>
              `;
            }).join("")}
          </div>
        </div>
      </form>
    `;

    modalFooter.innerHTML = `
      <button type="button" id="btn-update-pkg" class="btn btn-primary btn-sm">
        <i data-lucide="check"></i>
        <span>حفظ تعديلات الباقة</span>
      </button>
      <button type="button" id="btn-cancel-edit-pkg-modal" class="btn btn-outline btn-sm">إلغاء</button>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.app.openModal();

    document.getElementById("btn-cancel-edit-pkg-modal").addEventListener("click", () => window.app.closeModal());

    document.getElementById("btn-update-pkg").addEventListener("click", () => {
      const nameAr = document.getElementById("edit-pkg-name-ar").value.trim();
      const nameEn = document.getElementById("edit-pkg-name-en").value.trim();
      const price = parseFloat(document.getElementById("edit-pkg-price").value) || 0;
      const description = document.getElementById("edit-pkg-desc").value.trim();

      const checkedTests = Array.from(document.querySelectorAll('input[name="edit-pkg-test-select"]:checked')).map(cb => cb.value);

      if (!nameAr || checkedTests.length === 0) {
        window.app.showToast("يرجى إدخال اسم الباقة واختيار تحليل واحد على الأقل", "error");
        return;
      }

      window.store.updatePackage(pkgId, {
        nameAr,
        nameEn: nameEn || nameAr,
        price,
        description,
        testIds: checkedTests
      });

      window.app.showToast("تم تحديث الباقة بنجاح", "success");
      window.app.closeModal();
      this.activeTab = "packages";
      this.render();
    });
  }
};
