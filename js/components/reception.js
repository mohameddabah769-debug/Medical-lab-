/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * موديول الاستقبال وحجز الزيارات والفوترة (Reception & Orders Component)
 */

window.ReceptionComponent = {
  selectedItems: [], // عناصر السلة (تحاليل أو باقات)
  matchedPatientId: null, // كود المريض في حال كان مسجلاً مسبقاً

  render() {
    const container = document.getElementById("view-reception");
    if (!container) return;

    this.matchedPatientId = null;
    const tests = window.store.state.tests;
    const packages = window.store.state.packages;
    const contracts = window.store.state.contracts;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="user-plus"></i>
            <span>تسجيل مريض جديد وحجز التحاليل المخبرية</span>
          </div>
          <span style="font-size:0.85rem; color:var(--text-muted);">
            توليد كود تلقائي وباركود فوري لكل عينة
          </span>
        </div>

        <form id="reception-order-form">
          <!-- بيانات المريض الأساسية -->
          <h4 style="margin-bottom:14px; color:var(--primary); font-weight:700;">1. البيانات الشخصية والطبية للمريض</h4>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">اسم المريض بالكامل *</label>
              <input type="text" id="patient-name" class="form-control" placeholder="مثال: محمد سعيد إبراهيم" required />
            </div>

            <div class="form-group">
              <label class="form-label">السن (بالسنوات) *</label>
              <input type="number" id="patient-age" class="form-control" min="0" max="120" placeholder="مثال: 35" required />
            </div>

            <div class="form-group">
              <label class="form-label">النوع *</label>
              <select id="patient-gender" class="form-control" required>
                <option value="male">ذكر (Male)</option>
                <option value="female">أنثى (Female)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">رقم الهاتف / الواتساب</label>
              <input type="tel" id="patient-phone" class="form-control" placeholder="01xxxxxxxxx (يتعرف على المريض القديم فوراً)" />
            </div>

            <div class="form-group">
              <label class="form-label">الطبيب المعالج</label>
              <input type="text" id="patient-doctor" class="form-control" placeholder="اسم الطبيب أو العيادة المحولة" />
            </div>

            <div class="form-group">
              <label class="form-label">جهة التعاقد / التأمين</label>
              <select id="patient-contract" class="form-control">
                <option value="">بدون تعاقد (كشف خاص)</option>
                ${contracts.map(c => `
                  <option value="${c.id}" data-discount="${c.discountPercent}">
                    ${c.name} (خصم ${c.discountPercent}%)
                  </option>
                `).join("")}
              </select>
            </div>
          </div>

          <!-- صندوق التعرف التلقائي على المريض وسجل زياراته السابقة -->
          <div id="returning-patient-box" style="display:none; background-color:var(--bg-tertiary); border:1.5px solid var(--primary); border-radius:var(--radius-md); padding:14px 18px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px; color:var(--primary); font-weight:800; font-size:0.95rem;">
                <i data-lucide="user-check"></i>
                <span id="returning-patient-title">مريض مسجل مسبقاً بالمختبر</span>
              </div>
              <span class="badge badge-success" id="returning-patient-code"></span>
            </div>
            <div id="returning-patient-history" style="font-size:0.85rem;"></div>
          </div>

          <hr style="border:none; border-top:1px solid var(--border-color); margin:24px 0;" />

          <!-- اختيار التحاليل والباقات -->
          <h4 style="margin-bottom:14px; color:var(--primary); font-weight:700;">2. اختيار التحاليل والباقات المخبرية</h4>
          
          <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:24px; align-items:start;">
            <!-- قائمة التحاليل المتاحة للاختيار -->
            <div>
              <div style="margin-bottom:12px; display:flex; gap:10px;">
                <input type="text" id="catalog-search-input" class="form-control" placeholder="ابحث باسم التحليل أو الكود (مثال: CBC, سكر, ALT)..." />
              </div>

              <!-- قسم الباقات والعروض -->
              <div style="margin-bottom:16px;">
                <label style="font-weight:700; font-size:0.88rem; color:var(--text-secondary); margin-bottom:8px; display:block;">
                  باقات الفحص المخبري الشاملة (عروض بخصم إضافي):
                </label>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                  ${packages.map(pkg => `
                    <button type="button" class="btn btn-outline btn-sm btn-select-item" data-id="${pkg.id}" data-name="${pkg.nameAr}" data-price="${pkg.price}" style="border-style:dashed;">
                      <i data-lucide="gift" style="width:14px;height:14px; color:var(--warning);"></i>
                      <span>${pkg.nameAr}</span>
                      <strong style="color:var(--primary); margin-right:4px;">${pkg.price} ج.م</strong>
                    </button>
                  `).join("")}
                </div>
              </div>

              <!-- جدول الفحوصات الفردية للاختيار السريع -->
              <label style="font-weight:700; font-size:0.88rem; color:var(--text-secondary); margin-bottom:8px; display:block;">
                التحاليل الفردية:
              </label>
              <div style="max-height:280px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-md);">
                <table class="data-table" id="available-tests-table">
                  <thead>
                    <tr>
                      <th>الكود</th>
                      <th>اسم التحليل</th>
                      <th>القسم</th>
                      <th>السعر</th>
                      <th>إضافة</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tests.map(t => `
                      <tr class="test-row-item" data-search="${t.code.toLowerCase()} ${t.nameAr.toLowerCase()} ${t.nameEn.toLowerCase()}">
                        <td><strong>${t.code}</strong></td>
                        <td>
                          <strong>${t.nameAr}</strong>
                          <small style="display:block; color:var(--text-muted);">${t.nameEn}</small>
                          ${t.tube ? `<span style="font-size:0.72rem; color:var(--primary); font-weight:600; display:block; margin-top:2px;">🧪 ${t.tube}</span>` : ''}
                        </td>
                        <td><span class="badge badge-info" style="font-size:0.75rem;">${t.category}</span></td>
                        <td><strong>${t.price} ج.م</strong></td>
                        <td>
                          <button type="button" class="btn btn-primary btn-sm btn-select-item" data-id="${t.id}" data-name="${t.nameAr} (${t.code})" data-price="${t.price}">
                            <i data-lucide="plus" style="width:14px;height:14px;"></i>
                          </button>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- سلة التحاليل والحسابات المالية الفورية -->
            <div style="background-color:var(--bg-tertiary); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
              <h5 style="font-weight:800; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
                <span>التحاليل المختارة</span>
                <span id="selected-items-count" class="badge badge-info">0 تحليل</span>
              </h5>

              <div id="selected-items-list" style="min-height:120px; max-height:180px; overflow-y:auto; margin-bottom:16px;">
                <p style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding-top:40px;">
                  لم يتم اختيار أي تحاليل بعد. اضغط على (+) لإضافة فحص.
                </p>
              </div>

              <!-- خلاصة الحسابات المالية -->
              <div style="display:flex; flex-direction:column; gap:10px; font-size:0.95rem;">
                <div style="display:flex; justify-content:space-between;">
                  <span>إجمالي التحاليل:</span>
                  <strong><span id="calc-subtotal">0</span> ج.م</strong>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span>الخصم:</span>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <input type="number" id="calc-discount" class="form-control" style="width:80px; padding:4px 8px; font-weight:700;" value="0" min="0" />
                    <span>ج.م</span>
                  </div>
                </div>

                <div style="display:flex; justify-content:space-between; font-size:1.15rem; color:var(--primary); border-top:1px dashed var(--border-color); padding-top:8px;">
                  <strong>صافي المبلغ المطلوب:</strong>
                  <strong><span id="calc-net">0</span> ج.م</strong>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span>المدفوع نقداً/فيزا:</span>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <input type="number" id="calc-paid" class="form-control" style="width:90px; padding:4px 8px; font-weight:700; color:var(--success);" value="0" min="0" />
                    <span>ج.م</span>
                  </div>
                </div>

                <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--danger); border-top:1px solid var(--border-color); padding-top:8px;">
                  <span>المتبقي عند المريض:</span>
                  <span><span id="calc-remaining">0</span> ج.م</span>
                </div>

                <div class="form-group" style="margin-top:6px;">
                  <label class="form-label" style="font-size:0.8rem;">طريقة الدفع:</label>
                  <select id="calc-payment-method" class="form-control" style="padding:6px 10px;">
                    <option value="cash">نقداً (Cash)</option>
                    <option value="card">بطاقة بنكية / فيزا (POS)</option>
                    <option value="transfer">تحويل إلكتروني / إنستاباي</option>
                  </select>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="width:100%; margin-top:20px;">
                <i data-lucide="check-circle"></i>
                <span>حفظ الحجز وإصدار إيصال العينة</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // ربط تفاعلات الصفحة
    this.selectedItems = [];
    this.initEventListeners();
  },

  initEventListeners() {
    const container = document.getElementById("view-reception");
    if (!container) return;

    // التعرف التلقائي على المريض السابق برقم الهاتف وعرض سجل زياراته
    const phoneInput = document.getElementById("patient-phone");
    phoneInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      const returningBox = document.getElementById("returning-patient-box");
      const matched = window.store.findPatientByPhone(val);

      if (matched) {
        this.matchedPatientId = matched.id;
        document.getElementById("patient-name").value = matched.name;
        document.getElementById("patient-age").value = matched.age;
        document.getElementById("patient-gender").value = matched.gender;
        if (matched.doctor) document.getElementById("patient-doctor").value = matched.doctor;
        if (matched.contractId) {
          document.getElementById("patient-contract").value = matched.contractId;
          const contractSelect = document.getElementById("patient-contract");
          const selectedOption = contractSelect.options[contractSelect.selectedIndex];
          if (selectedOption) {
            const discountPct = parseFloat(selectedOption.getAttribute("data-discount")) || 0;
            const subtotal = this.selectedItems.reduce((sum, i) => sum + i.price, 0);
            const discountAmount = Math.round((subtotal * discountPct) / 100);
            document.getElementById("calc-discount").value = discountAmount;
            this.recalculateTotals();
          }
        }

        // إظهار سجل الزيارات السابقة
        returningBox.style.display = "block";
        document.getElementById("returning-patient-code").textContent = `كود: ${matched.id}`;
        
        const previousOrders = window.store.state.orders.filter(o => o.patientId === matched.id);
        const historyContainer = document.getElementById("returning-patient-history");

        historyContainer.innerHTML = `
          <div style="margin-top:6px; color:var(--text-primary); font-weight:700;">
            سجل التحاليل والزيارات السابقة (${previousOrders.length} زيارات):
          </div>
          <div style="max-height:140px; overflow-y:auto; margin-top:6px; display:flex; flex-direction:column; gap:6px;">
            ${previousOrders.length === 0 ? '<div style="color:var(--text-muted); padding:4px;">لا توجد عينات سابقة مسجلة</div>' : 
              previousOrders.map(po => `
                <div style="background:var(--bg-card); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span style="font-family:var(--font-mono); font-weight:700; color:var(--primary); font-size:0.9rem;">${po.barcode}</span>
                    <span style="font-size:0.75rem; color:var(--text-muted); margin-right:8px;">${new Date(po.createdAt).toLocaleDateString('ar-EG')}</span>
                    <span style="font-size:0.8rem; margin-right:8px;">[${po.testsRequested.length} فحص]</span>
                  </div>
                  <div>
                    <span class="badge ${po.status === 'validated' ? 'badge-success' : 'badge-pending'}" style="font-size:0.72rem;">${po.status === 'validated' ? 'معتمد' : 'قيد الفحص'}</span>
                    <button type="button" class="btn btn-outline btn-sm action-view-history-report" data-order-id="${po.id}" style="padding:3px 10px; font-size:0.75rem; margin-right:8px;">
                      عرض التقرير
                    </button>
                  </div>
                </div>
              `).join("")
            }
          </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        historyContainer.querySelectorAll(".action-view-history-report").forEach(b => {
          b.addEventListener("click", () => {
            const oid = b.getAttribute("data-order-id");
            window.store.setView("medical-report", oid);
          });
        });

        window.app.showToast(`تم التعرف على المريض: ${matched.name} واسترجاع سجل زياراته بنجاح`, "info");
      } else {
        this.matchedPatientId = null;
        returningBox.style.display = "none";
      }
    });

    // البحث في التحاليل
    const searchInput = document.getElementById("catalog-search-input");
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      container.querySelectorAll(".test-row-item").forEach(row => {
        const text = row.getAttribute("data-search");
        row.style.display = text.includes(term) ? "" : "none";
      });
    });

    // إضافة تحليل/باقة إلى السلة
    container.querySelectorAll(".btn-select-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");
        const price = parseFloat(btn.getAttribute("data-price")) || 0;

        if (this.selectedItems.some(i => i.id === id)) {
          window.app.showToast("هذا التحليل مضاف بالفعل في السلة", "info");
          return;
        }

        this.selectedItems.push({ id, name, price });
        this.updateCartUI();
      });
    });

    // تغيير جهة التعاقد لحساب نسبة الخصم تلقائياً
    const contractSelect = document.getElementById("patient-contract");
    contractSelect.addEventListener("change", () => {
      const selectedOption = contractSelect.options[contractSelect.selectedIndex];
      const discountPct = parseFloat(selectedOption.getAttribute("data-discount")) || 0;
      
      const subtotal = this.selectedItems.reduce((sum, i) => sum + i.price, 0);
      const discountAmount = Math.round((subtotal * discountPct) / 100);
      document.getElementById("calc-discount").value = discountAmount;
      this.recalculateTotals();
    });

    // تغيير يدوي في الخصم أو المدفوع
    document.getElementById("calc-discount").addEventListener("input", () => this.recalculateTotals());
    document.getElementById("calc-paid").addEventListener("input", () => this.recalculateTotals());

    // تسليم النموذج وحفظ الحجز
    const form = document.getElementById("reception-order-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  },

  updateCartUI() {
    const listEl = document.getElementById("selected-items-list");
    const countBadge = document.getElementById("selected-items-count");
    countBadge.textContent = `${this.selectedItems.length} عنصر`;

    if (this.selectedItems.length === 0) {
      listEl.innerHTML = `
        <p style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding-top:40px;">
          لم يتم اختيار أي تحاليل بعد. اضغط على (+) لإضافة فحص.
        </p>
      `;
    } else {
      listEl.innerHTML = this.selectedItems.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background-color:var(--bg-card); border-radius:var(--radius-sm); margin-bottom:6px; border:1px solid var(--border-color);">
          <div style="font-weight:600; font-size:0.88rem;">${item.name}</div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; color:var(--primary);">${item.price} ج.م</span>
            <button type="button" class="btn-remove-item" data-index="${idx}" style="background:none; border:none; color:var(--danger); cursor:pointer;">
              <i data-lucide="trash-2" style="width:15px;height:15px;"></i>
            </button>
          </div>
        </div>
      `).join("");

      if (window.lucide) window.lucide.createIcons();

      listEl.querySelectorAll(".btn-remove-item").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-index"));
          this.selectedItems.splice(idx, 1);
          this.updateCartUI();
        });
      });
    }

    this.recalculateTotals();
  },

  recalculateTotals() {
    const subtotal = this.selectedItems.reduce((sum, i) => sum + i.price, 0);
    const discountInput = document.getElementById("calc-discount");
    const paidInput = document.getElementById("calc-paid");

    let discount = parseFloat(discountInput.value) || 0;
    if (discount > subtotal) discount = subtotal;

    const net = Math.max(0, subtotal - discount);

    // إذا كان المدفوع مساوياً للصفر أو أول مرة، نقترح السداد بالكامل
    if (paidInput.dataset.dirty !== "true") {
      paidInput.value = net;
    }

    let paid = parseFloat(paidInput.value) || 0;
    if (paid > net) paid = net;

    const remaining = Math.max(0, net - paid);

    document.getElementById("calc-subtotal").textContent = subtotal;
    document.getElementById("calc-net").textContent = net;
    document.getElementById("calc-remaining").textContent = remaining;

    paidInput.addEventListener("input", () => {
      paidInput.dataset.dirty = "true";
    }, { once: true });
  },

  handleFormSubmit() {
    if (this.selectedItems.length === 0) {
      window.app.showToast("يرجى اختيار تحليل واحد على الأقل للمريض", "error");
      return;
    }

    const patientName = document.getElementById("patient-name").value;
    const patientAge = document.getElementById("patient-age").value;
    const patientGender = document.getElementById("patient-gender").value;
    const patientPhone = document.getElementById("patient-phone").value;
    const patientDoctor = document.getElementById("patient-doctor").value;
    const patientContract = document.getElementById("patient-contract").value;

    const discountAmount = parseFloat(document.getElementById("calc-discount").value) || 0;
    const paidAmount = parseFloat(document.getElementById("calc-paid").value) || 0;
    const paymentMethod = document.getElementById("calc-payment-method").value;

    // 1. تسجيل مريض جديد أو تحديث بيانات المريض السابق المسجل
    let targetPatient;
    if (this.matchedPatientId) {
      targetPatient = window.store.updatePatient(this.matchedPatientId, {
        name: patientName,
        age: patientAge,
        gender: patientGender,
        phone: patientPhone,
        doctor: patientDoctor,
        contractId: patientContract || null
      });
    } else {
      targetPatient = window.store.addPatient({
        name: patientName,
        age: patientAge,
        gender: patientGender,
        phone: patientPhone,
        doctor: patientDoctor,
        contractId: patientContract || null
      });
    }

    // 2. إنشاء الطلب
    const testIds = this.selectedItems.map(i => i.id);
    const newOrder = window.store.createOrder({
      patientId: targetPatient.id,
      testIds,
      discountAmount,
      paidAmount,
      paymentMethod
    });

    window.app.showToast(`تم حجز الزيارة بنجاح بكود عينة: ${newOrder.barcode}`, "success");

    // 3. عرض إيصال الاستلام الفوري مع الباركود في نافذة Modal
    this.showReceiptModal(newOrder, targetPatient);
  },

  showReceiptModal(order, patient) {
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `<i data-lucide="receipt" style="color:var(--primary);"></i> إيصال استلام عينة وخدمة مخبرية`;

    const barcodeSVG = window.LabBarcode.renderBarcodeSVG(order.barcode, 200, 48);

    modalBody.innerHTML = `
      <div id="receipt-printable-content" style="padding:10px; font-family:var(--font-sans);">
        <div style="text-align:center; border-bottom:2px dashed var(--border-color); padding-bottom:14px; margin-bottom:14px;">
          <h3 style="font-weight:800; color:var(--primary); font-size:1.3rem;">${window.store.state.labProfile.nameAr}</h3>
          <p style="font-size:0.82rem; color:var(--text-muted);">${window.store.state.labProfile.address} | هاتف: ${window.store.state.labProfile.phone}</p>
          <div style="margin:12px auto;">
            ${barcodeSVG}
          </div>
          <div style="font-size:0.88rem; font-weight:700;">رقم الإيصال: ${order.id}</div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.88rem; margin-bottom:14px; background:var(--bg-tertiary); padding:10px; border-radius:var(--radius-md);">
          <div><strong>المريض:</strong> ${patient.name}</div>
          <div><strong>كود المريض:</strong> ${patient.id}</div>
          <div><strong>السن / النوع:</strong> ${patient.age} سنة (${patient.gender === 'male' ? 'ذكر' : 'أنثى'})</div>
          <div><strong>الهاتف:</strong> ${patient.phone || '-'}</div>
          <div><strong>الطبيب:</strong> ${patient.doctor || 'طلب مباشر'}</div>
          <div><strong>تاريخ السحب:</strong> ${new Date(order.createdAt).toLocaleString('ar-EG')}</div>
        </div>

        <div style="margin-bottom:14px;">
          <strong style="font-size:0.88rem; display:block; margin-bottom:6px;">التحاليل والفحوصات المطلوبة:</strong>
          <ul style="padding-right:20px; font-size:0.85rem; line-height:1.8;">
            ${order.testsRequested.map(tId => {
              const t = window.store.state.tests.find(item => item.id === tId);
              return `<li><strong>${t ? t.nameAr + ' (' + t.code + ')' : tId}</strong> ${t && t.tube ? `<span style="font-size:0.75rem; color:var(--primary); margin-right:4px;">[${t.tube}]</span>` : ''}</li>`;
            }).join("")}
          </ul>
        </div>

        <div style="border-top:1px dashed var(--border-color); padding-top:10px; display:flex; flex-direction:column; gap:4px; font-size:0.9rem;">
          <div style="display:flex; justify-content:space-between;">
            <span>الإجمالي:</span>
            <span>${order.totalAmount} ج.م</span>
          </div>
          ${order.discountAmount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:var(--primary);">
              <span>قيمة الخصم:</span>
              <span>- ${order.discountAmount} ج.م</span>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; font-weight:700;">
            <span>الصافي المطلوب:</span>
            <span>${order.netAmount} ج.م</span>
          </div>
          <div style="display:flex; justify-content:space-between; color:var(--success); font-weight:700;">
            <span>المدفوع:</span>
            <span>${order.paidAmount} ج.م</span>
          </div>
          ${order.remainingAmount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:var(--danger); font-weight:800;">
              <span>المتبقي عند الاستلام:</span>
              <span>${order.remainingAmount} ج.م</span>
            </div>
          ` : '<div style="color:var(--success); font-weight:700; text-align:center; margin-top:4px;">★ تم السداد بالكامل ★</div>'}
        </div>

        <div style="text-align:center; font-size:0.75rem; color:var(--text-muted); margin-top:16px; border-top:1px solid var(--border-color); padding-top:8px;">
          شكراً لثقتكم بمختبرنا. برجاء إحضار هذا الإيصال أو كود العينة عند استلام النتيجة.
        </div>
        <div style="text-align:center; font-size:0.68rem; color:var(--text-muted); margin-top:6px; font-family:var(--font-sans);">
          نظام LabCore Pro — تطوير: سند لتطوير البرمجيات (Sanad Digital) | م/ محمد الدباح • 01501084747 © 2026
        </div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button id="btn-print-receipt" class="btn btn-primary btn-sm">
        <i data-lucide="printer"></i>
        <span>طباعة الإيصال الفوري</span>
      </button>
      <button id="btn-proceed-results" class="btn btn-success btn-sm">
        <i data-lucide="arrow-left"></i>
        <span>الانتقال لإدخال النتائج</span>
      </button>
      <button id="btn-close-receipt" class="btn btn-outline btn-sm">
        <span>إغلاق</span>
      </button>
    `;

    if (window.lucide) window.lucide.createIcons();

    window.app.openModal();

    document.getElementById("btn-print-receipt").addEventListener("click", () => {
      window.print();
    });

    document.getElementById("btn-proceed-results").addEventListener("click", () => {
      window.app.closeModal();
      window.store.setView("results", order.id);
    });

    document.getElementById("btn-close-receipt").addEventListener("click", () => {
      window.app.closeModal();
      this.render(); // إعادة تهيئة نموذج الاستقبال لمريض جديد
    });
  }
};
