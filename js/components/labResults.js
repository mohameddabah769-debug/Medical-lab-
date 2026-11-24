/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * موديول إدخال النتائج والمراجعة الطبية والاعتماد (Lab Results & Validation)
 */

window.LabResultsComponent = {
  render() {
    const container = document.getElementById("view-results");
    if (!container) return;

    const orders = window.store.state.orders;
    let activeOrderId = window.store.state.activeOrderId;

    // إذا لم يكن هناك طلب محدد، نختار أول طلب معلق أو أول طلب في القائمة
    if (!activeOrderId || !window.store.getOrder(activeOrderId)) {
      const firstPending = orders.find(o => o.status === "pending") || orders[0];
      if (firstPending) {
        activeOrderId = firstPending.id;
        window.store.state.activeOrderId = activeOrderId;
      }
    }

    const currentOrder = window.store.getOrder(activeOrderId);
    const currentPatient = currentOrder ? window.store.getPatient(currentOrder.patientId) : null;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: 320px 1fr; gap:22px; align-items:start;">
        
        <!-- القائمة الجانبية للعينات والطلبات -->
        <div class="card" style="padding:16px;">
          <div class="card-header" style="margin-bottom:12px; padding-bottom:8px;">
            <div class="card-title" style="font-size:1rem;">
              <i data-lucide="inbox"></i>
              <span>قائمة العينات (${orders.length})</span>
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <input type="text" id="order-search-filter" class="form-control" placeholder="بحث برقم الباركود أو المريض..." style="font-size:0.85rem;" />
          </div>

          <!-- قائمة العينات القابلة للتمرير -->
          <div style="max-height:550px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;" id="order-items-list">
            ${orders.map(o => {
              const p = window.store.getPatient(o.patientId) || { name: "غير محدد" };
              const isSelected = o.id === activeOrderId;
              
              let statusLabel = '';
              let statusClass = '';
              if (o.status === 'validated') {
                statusLabel = 'معتمد';
                statusClass = 'badge-success';
              } else if (o.status === 'completed') {
                statusLabel = 'بانتظار الاعتماد';
                statusClass = 'badge-info';
              } else {
                statusLabel = 'قيد الإدخال';
                statusClass = 'badge-pending';
              }

              return `
                <div class="order-list-card ${isSelected ? 'selected' : ''}" data-order-id="${o.id}" 
                     data-search="${o.barcode.toLowerCase()} ${p.name.toLowerCase()}"
                     style="padding:10px 12px; border-radius:var(--radius-md); border:1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}; background-color:${isSelected ? 'var(--primary-light)' : 'var(--bg-card)'}; cursor:pointer; transition:all var(--transition-fast);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="font-family:var(--font-mono); color:${isSelected ? 'var(--primary)' : 'var(--text-primary)'}; font-size:0.95rem;">${o.barcode}</strong>
                    <span class="badge ${statusClass}" style="font-size:0.7rem;">${statusLabel}</span>
                  </div>
                  <div style="font-size:0.88rem; font-weight:700; color:var(--text-primary); margin-bottom:2px;">${p.name}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between;">
                    <span>${o.testsRequested.length} فحص مطلوب</span>
                    <span>${new Date(o.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- منطقة إدخال النتائج والمراجعة الطبية -->
        <div class="card">
          ${!currentOrder ? `
            <div style="text-align:center; padding:50px; color:var(--text-muted);">
              يرجى اختيار عينة من القائمة لبدء إدخال النتائج.
            </div>
          ` : `
            <!-- شريط معلومات العينة والمريض -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:16px; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
              <div>
                <div style="display:flex; align-items:center; gap:10px;">
                  <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary);">${currentPatient.name}</h3>
                  <span class="badge ${currentOrder.status === 'validated' ? 'badge-success' : (currentOrder.status === 'completed' ? 'badge-info' : 'badge-pending')}" style="font-size:0.82rem;">
                    ${currentOrder.status === 'validated' ? 'معتمد رسمياً ✓' : (currentOrder.status === 'completed' ? 'تم الرصد (بانتظار الاعتماد)' : 'قيد فحص العينة')}
                  </span>
                </div>
                <div style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">
                  السن: <strong>${currentPatient.age} سنة</strong> | النوع: <strong>${currentPatient.gender === 'male' ? 'ذكر' : 'أنثى'}</strong> | كود العينة: <strong style="font-family:var(--font-mono); color:var(--primary);">${currentOrder.barcode}</strong> | الطبيب: <strong>${currentPatient.doctor}</strong>
                </div>
              </div>

              <div style="display:flex; gap:8px;">
                <button id="btn-quick-view-report" class="btn btn-outline btn-sm">
                  <i data-lucide="printer"></i>
                  <span>معاينة التقرير الرسمي</span>
                </button>
              </div>
            </div>

            <!-- نموذج رصد النتائج مقسمة لكل تحليل -->
            <form id="lab-results-form">
              <div id="tests-entry-container" style="display:flex; flex-direction:column; gap:24px;">
                ${currentOrder.testsRequested.map(testId => {
                  const testObj = window.store.state.tests.find(t => t.id === testId);
                  if (!testObj) return '';

                  const existingTestResults = currentOrder.results[testId] || {};

                  return `
                    <div class="test-entry-block" style="border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden;">
                      <div style="background-color:var(--bg-tertiary); padding:10px 16px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                          <div style="font-weight:800; font-size:0.95rem; color:var(--primary);">
                            ${testObj.nameAr} - <span style="font-size:0.85rem; color:var(--text-secondary); font-family:var(--font-sans);">${testObj.nameEn} (${testObj.code})</span>
                          </div>
                          ${testObj.tube ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">🧪 أنبوبة السحب: <strong style="color:var(--text-primary);">${testObj.tube}</strong></div>` : ''}
                        </div>
                        <span class="badge badge-info" style="font-size:0.75rem;">${testObj.category}</span>
                      </div>

                      <div style="padding:14px 16px;">
                        <table style="width:100%; border-collapse:collapse;">
                          <thead>
                            <tr style="font-size:0.82rem; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">
                              <th style="padding:8px 6px; text-align:right;">المتغير (Parameter)</th>
                              <th style="padding:8px 6px; text-align:right; width:170px;">النتيجة المرصودة</th>
                              <th style="padding:8px 6px; text-align:right; width:110px;">الوحدة (Unit)</th>
                              <th style="padding:8px 6px; text-align:right; width:160px;">المدى الطبيعي</th>
                              <th style="padding:8px 6px; text-align:center; width:150px;">التقييم الفوري (Flag)</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${(testObj.parameters || []).map(param => {
                              const range = window.LabValidator.getParamRange(param, currentPatient ? currentPatient.gender : 'male');
                              const val = existingTestResults[param.key] !== undefined ? existingTestResults[param.key] : '';
                              const evaluation = window.LabValidator.evaluate(val, range.min, range.max);

                              return `
                                <tr style="border-bottom:1px solid var(--border-color);">
                                  <td style="padding:10px 6px;">
                                    <strong style="font-size:0.9rem;">${param.name}</strong>
                                    <small style="display:block; color:var(--text-muted); font-size:0.75rem;">${param.key.toUpperCase()}</small>
                                  </td>
                                  <td style="padding:10px 6px;">
                                    <input type="number" step="any" 
                                           class="form-control result-input-field ${evaluation.isAbnormal ? (evaluation.status === 'HIGH' ? 'input-high' : 'input-low') : ''}" 
                                           data-test-id="${testId}" 
                                           data-param-key="${param.key}" 
                                           data-min="${range.min !== undefined ? range.min : ''}" 
                                           data-max="${range.max !== undefined ? range.max : ''}" 
                                           value="${val}" 
                                           ${currentOrder.status === 'validated' ? 'disabled' : ''}
                                           placeholder="القيمة..." 
                                           style="font-family:var(--font-mono); font-weight:700; font-size:1rem; padding:6px 10px;" />
                                  </td>
                                  <td style="padding:10px 6px; font-family:var(--font-mono); font-size:0.85rem; color:var(--text-secondary);">
                                    ${param.unit || '-'}
                                  </td>
                                  <td style="padding:10px 6px; font-size:0.85rem; color:var(--text-muted);">
                                    ${window.LabValidator.formatRange(range.min, range.max, param.unit)}
                                  </td>
                                  <td style="padding:10px 6px; text-align:center;" id="flag-cell-${testId}-${param.key}">
                                    <span class="${evaluation.cssClass}" style="font-size:0.82rem;">
                                      ${evaluation.label}
                                    </span>
                                  </td>
                                </tr>
                              `;
                            }).join("")}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>

              <!-- الملاحظات الطبية وقسم الاعتماد -->
              <div style="margin-top:24px; background-color:var(--bg-tertiary); padding:18px; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
                <div class="form-group" style="margin-bottom:16px;">
                  <label class="form-label" style="font-weight:700;">
                    <i data-lucide="file-text" style="width:16px;height:16px; display:inline-block; vertical-align:middle;"></i>
                    ملاحظات الطبيب الاستشاري ومدير المعمل (تظهر بالتقرير المطبوع):
                  </label>
                  <textarea id="lab-doctor-notes" class="form-control" rows="2" 
                            placeholder="اكتب أي تعليقات تشخيصية إضافية موجهة للطبيب المعالج أو المريض..."
                            ${currentOrder.status === 'validated' ? 'disabled' : ''}>${currentOrder.doctorNotes || ''}</textarea>
                </div>

                ${currentOrder.status === 'validated' ? `
                  <div style="display:flex; justify-content:space-between; align-items:center; background-color:var(--success-light); padding:12px 18px; border-radius:var(--radius-md); border:1px solid var(--success);">
                    <div style="display:flex; align-items:center; gap:10px; color:var(--success-text);">
                      <i data-lucide="shield-check" style="width:24px;height:24px;"></i>
                      <div>
                        <strong>تم اعتماد النتيجة رسمياً من مدير المعمل:</strong>
                        <div style="font-size:0.82rem;">${currentOrder.validatedBy} في ${new Date(currentOrder.validatedAt).toLocaleString('ar-EG')}</div>
                      </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                      ${window.store.hasPermission("validate_results") ? `
                        <button type="button" id="btn-unvalidate-order" class="btn btn-outline btn-sm" style="color:var(--danger); border-color:var(--danger);">
                          <i data-lucide="unlock"></i>
                          <span>فك الاعتماد للتعديل</span>
                        </button>
                      ` : ''}
                      <button type="button" id="btn-view-validated-report" class="btn btn-success btn-sm">
                        <i data-lucide="printer"></i>
                        <span>طباعة التقرير المعتمد (A4)</span>
                      </button>
                    </div>
                  </div>
                ` : `
                  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <button type="button" id="btn-save-draft" class="btn btn-outline">
                      <i data-lucide="save"></i>
                      <span>حفظ النتائج مؤقتاً (مسودة)</span>
                    </button>

                    ${window.store.hasPermission("validate_results") ? `
                      <button type="button" id="btn-approve-validate" class="btn btn-primary btn-lg" style="box-shadow:0 4px 14px var(--primary-glow);">
                        <i data-lucide="check-check"></i>
                        <span>اعتماد النتيجة رسمياً وقفل التقرير (Approve)</span>
                      </button>
                    ` : `
                      <button type="button" class="btn btn-outline" disabled title="خاص بمدير المختبر فقط" style="opacity:0.65; cursor:not-allowed;">
                        <i data-lucide="lock"></i>
                        <span>اعتماد النتيجة (مقتصر على مدير المختبر)</span>
                      </button>
                    `}
                  </div>
                `}
              </div>
            </form>
          `}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    this.initEventListeners(currentOrder);
  },

  initEventListeners(currentOrder) {
    const container = document.getElementById("view-results");
    if (!container) return;

    // فلترة وبحث قائمة العينات
    const searchInput = document.getElementById("order-search-filter");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase().trim();
        container.querySelectorAll(".order-list-card").forEach(card => {
          const text = card.getAttribute("data-search");
          card.style.display = text.includes(term) ? "" : "none";
        });
      });
    }

    // التنقل بين العينات بالنقر عليها
    container.querySelectorAll(".order-list-card").forEach(card => {
      card.addEventListener("click", () => {
        const orderId = card.getAttribute("data-order-id");
        window.store.setView("results", orderId);
      });
    });

    if (!currentOrder) return;

    // تقييم مباشر للنتائج عند الكتابة (Live High/Low Flagging)
    container.querySelectorAll(".result-input-field").forEach(input => {
      input.addEventListener("input", () => {
        const testId = input.getAttribute("data-test-id");
        const paramKey = input.getAttribute("data-param-key");
        const min = input.getAttribute("data-min") !== "" ? parseFloat(input.getAttribute("data-min")) : undefined;
        const max = input.getAttribute("data-max") !== "" ? parseFloat(input.getAttribute("data-max")) : undefined;
        const val = input.value;

        const evalResult = window.LabValidator.evaluate(val, min, max);

        // تحديث خلية الـ Flag
        const flagCell = document.getElementById(`flag-cell-${testId}-${paramKey}`);
        if (flagCell) {
          flagCell.innerHTML = `
            <span class="${evalResult.cssClass}" style="font-size:0.82rem;">
              ${evalResult.label}
            </span>
          `;
        }

        // تنسيق الحقل نفسه
        input.classList.remove("input-high", "input-low");
        if (evalResult.status === "HIGH") {
          input.style.borderColor = "var(--danger)";
          input.style.backgroundColor = "var(--danger-light)";
        } else if (evalResult.status === "LOW") {
          input.style.borderColor = "#0284c7";
          input.style.backgroundColor = "#e0f2fe";
        } else {
          input.style.borderColor = "var(--border-color)";
          input.style.backgroundColor = "var(--bg-input)";
        }
      });
    });

    // جمع كافة النتائج من النموذج
    const collectResultsFromUI = () => {
      const results = {};
      container.querySelectorAll(".result-input-field").forEach(input => {
        const testId = input.getAttribute("data-test-id");
        const paramKey = input.getAttribute("data-param-key");
        const val = input.value.trim();

        if (!results[testId]) results[testId] = {};
        if (val !== "") {
          results[testId][paramKey] = parseFloat(val);
        }
      });
      const doctorNotes = document.getElementById("lab-doctor-notes") ? document.getElementById("lab-doctor-notes").value : "";
      return { results, doctorNotes };
    };

    // حفظ المسودة
    const btnDraft = document.getElementById("btn-save-draft");
    if (btnDraft) {
      btnDraft.addEventListener("click", () => {
        const { results, doctorNotes } = collectResultsFromUI();
        window.store.updateOrderResults(currentOrder.id, results, doctorNotes);
        window.app.showToast("تم حفظ النتائج كمسودة بنجاح", "success");
        this.render();
      });
    }

    // اعتماد النتيجة رسمياً
    const btnApprove = document.getElementById("btn-approve-validate");
    if (btnApprove) {
      btnApprove.addEventListener("click", () => {
        const { results, doctorNotes } = collectResultsFromUI();
        window.store.updateOrderResults(currentOrder.id, results, doctorNotes);
        const approver = window.store.getCurrentUser().name;
        window.store.validateOrder(currentOrder.id, approver);
        window.app.showToast(`تم اعتماد التقرير الطبي رسمياً بواسطة ${approver}`, "success");
        this.render();
      });
    }

    // فك الاعتماد للتعديل
    const btnUnvalidate = document.getElementById("btn-unvalidate-order");
    if (btnUnvalidate) {
      btnUnvalidate.addEventListener("click", () => {
        if (confirm("هل تريد بالتأكيد فك اعتماد التقرير وإعادته للوضع القابل للتعديل؟")) {
          window.store.unvalidateOrder(currentOrder.id);
          window.app.showToast("تم فك الاعتماد وأصبح التقرير متاحاً للتعديل", "info");
          this.render();
        }
      });
    }

    // زر الانتقال للمعاينة والطباعة
    const btnViewReport = document.getElementById("btn-quick-view-report");
    if (btnViewReport) {
      btnViewReport.addEventListener("click", () => {
        window.store.setView("medical-report", currentOrder.id);
      });
    }

    const btnViewValidatedReport = document.getElementById("btn-view-validated-report");
    if (btnViewValidatedReport) {
      btnViewValidatedReport.addEventListener("click", () => {
        window.store.setView("medical-report", currentOrder.id);
      });
    }
  }
};
