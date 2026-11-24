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
                        <button class="action-icon-btn btn-delete-test" data-id="${t.id}" title="حذف التحليل" style="display:inline-flex; width:34px; height:34px; color:var(--danger);">
                          <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                        </button>
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
                    <h4 style="font-weight:800; color:var(--primary);">${pkg.nameAr}</h4>
                    <span class="badge badge-success" style="font-size:0.9rem;">${pkg.price} ج.م</span>
                  </div>
                  <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:12px;">${pkg.nameEn}</div>
                  <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">${pkg.description || 'باقة شاملة مجمعة'}</p>
                  
                  <div style="font-size:0.82rem; border-top:1px dashed var(--border-color); padding-top:10px;">
                    <strong style="display:block; margin-bottom:6px;">التحاليل المشمولة (${pkg.testIds.length}):</strong>
                    <div style="display:flex; flex-wrap:wrap; gap:4px;">
                      ${testNames.map(name => `
                        <span class="badge badge-info" style="font-size:0.75rem;">${name}</span>
                      `).join("")}
                    </div>
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
              <option value="صورة الدم وأمراض الدم">صورة الدم وأمراض الدم</option>
              <option value="كيمياء الدم العامة">كيمياء الدم العامة</option>
              <option value="السكري والتمثيل الغذائي">السكري والتمثيل الغذائي</option>
              <option value="الدهون وصحة القلب">الدهون وصحة القلب</option>
              <option value="الهرمونات والغدد الصماء">الهرمونات والغدد الصماء</option>
              <option value="المناعة والأمصال">المناعة والأمصال</option>
              <option value="المايكروبيولوجي والبول والبراز">المايكروبيولوجي والبول والبراز</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">سعر التحليل (ج.م) *</label>
            <input type="number" id="new-test-price" class="form-control" min="0" placeholder="مثال: 90" required />
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
      const code = document.getElementById("new-test-code").value;
      const nameAr = document.getElementById("new-test-name-ar").value;
      const nameEn = document.getElementById("new-test-name-en").value;
      const category = document.getElementById("new-test-category").value;
      const price = document.getElementById("new-test-price").value;
      const unit = document.getElementById("new-test-unit").value;
      const min = document.getElementById("new-test-min").value;
      const max = document.getElementById("new-test-max").value;

      if (!code || !nameAr || !price) {
        window.app.showToast("يرجى ملء الحقول الإلزامية المطلوبة", "error");
        return;
      }

      window.store.addTest({
        code,
        nameAr,
        nameEn: nameEn || code,
        category,
        price,
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

      window.app.showToast("تمت إضافة التحليل بنجاح", "success");
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
          <div style="max-height:200px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:6px;">
            ${tests.map(t => `
              <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; cursor:pointer;">
                <input type="checkbox" name="pkg-test-select" value="${t.id}" />
                <span><strong>${t.code}</strong> - ${t.nameAr}</span>
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
      const nameAr = document.getElementById("new-pkg-name-ar").value;
      const nameEn = document.getElementById("new-pkg-name-en").value;
      const price = document.getElementById("new-pkg-price").value;
      const description = document.getElementById("new-pkg-desc").value;

      const checkedTests = Array.from(document.querySelectorAll('input[name="pkg-test-select"]:checked')).map(cb => cb.value);

      if (!nameAr || !price || checkedTests.length === 0) {
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
  }
};
