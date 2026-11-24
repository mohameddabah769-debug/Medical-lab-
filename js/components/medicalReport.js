/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * موديول التقرير الطبي والطباعة الرسمية A4 القياسية (Medical Report Component)
 */

window.MedicalReportComponent = {
  render() {
    const container = document.getElementById("view-medical-report");
    if (!container) return;

    const orders = window.store.state.orders;
    let activeOrderId = window.store.state.activeOrderId;

    if (!activeOrderId || !window.store.getOrder(activeOrderId)) {
      const firstReady = orders.find(o => o.status === "validated") || orders[0];
      if (firstReady) {
        activeOrderId = firstReady.id;
        window.store.state.activeOrderId = activeOrderId;
      }
    }

    const order = window.store.getOrder(activeOrderId);
    const patient = order ? window.store.getPatient(order.patientId) : null;
    const lab = window.store.state.labProfile;

    container.innerHTML = `
      <!-- شريط أدوات التقرير (يختفي عند الطباعة) -->
      <div class="card no-print" style="margin-bottom:20px; padding:14px 20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <label style="font-weight:700; font-size:0.9rem;">اختر العينة / المريض للمعاينة والطباعة:</label>
            <select id="select-report-order" class="form-control" style="width:280px; padding:6px 12px;">
              ${orders.map(o => {
                const p = window.store.getPatient(o.patientId) || { name: "غير محدد" };
                return `
                  <option value="${o.id}" ${o.id === activeOrderId ? 'selected' : ''}>
                    ${o.barcode} - ${p.name} (${o.status === 'validated' ? 'معتمد' : 'مسودة'})
                  </option>
                `;
              }).join("")}
            </select>
          </div>

          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button id="btn-whatsapp-notify" class="btn btn-sm" style="background-color:#25d366; color:#ffffff; font-weight:700; box-shadow:0 2px 8px rgba(37,211,102,0.3);" title="إرسال إشعار جاهزية النتيجة على واتساب المريض">
              <i data-lucide="message-circle"></i>
              <span>إرسال واتساب</span>
            </button>

            <button id="btn-back-to-results" class="btn btn-outline btn-sm">
              <i data-lucide="arrow-right"></i>
              <span>العودة لإدخال النتائج</span>
            </button>

            <button id="btn-trigger-print" class="btn btn-primary btn-sm" style="box-shadow:0 2px 10px var(--primary-glow);">
              <i data-lucide="printer"></i>
              <span>طباعة التقرير الطبي الرسمي (A4 / PDF)</span>
            </button>
          </div>
        </div>
      </div>

      ${!order || !patient ? `
        <div class="card" style="text-align:center; padding:50px; color:var(--text-muted);">
          يرجى اختيار مريض لعرض وطباعة تقريره الطبي.
        </div>
      ` : `
        <!-- صفحة التقرير الطبي A4 المعيارية الرسمية -->
        <div class="print-page card" style="background:#ffffff; color:#0f172a; max-width:850px; margin:0 auto; padding:32px 36px; border:1px solid #cbd5e1; box-shadow:var(--shadow-lg); font-family:var(--font-sans); position:relative;">
          
          <!-- علامة مائية رقمية لحفظ حقوق التقرير الطبي والنشر -->
          <div class="print-watermark" aria-hidden="true">
            <div>سند لتطوير البرمجيات</div>
            <div style="font-size:20pt; opacity:0.8;">Sanad Digital • LabCore Pro</div>
            <div style="font-size:14pt; opacity:0.7;">م/ محمد الدباح</div>
          </div>

          <!-- ترويسة التقرير الرسمية -->
          <div class="print-header" style="border-bottom:2.5px solid #0284c7; padding-bottom:14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="width:56px; height:56px; border-radius:10px; overflow:hidden; background:#fff; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center;">
                <img src="assets/serum-logo.jpg" alt="شعار المعمل" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div style="display:none; width:100%; height:100%; background:linear-gradient(135deg, #0284c7, #0369a1); align-items:center; justify-content:center; color:#fff; font-size:26px;">
                  <i data-lucide="microscope"></i>
                </div>
              </div>
              <div>
                <h1 style="font-size:1.35rem; font-weight:900; color:#0284c7; margin:0; line-height:1.2;">${lab.nameAr}</h1>
                <div style="font-size:0.85rem; font-weight:700; color:#334155;">${lab.nameEn}</div>
                <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">ترخيص وزارة الصحة: ${lab.licenseNo} | مدير المعمل: ${lab.directorName}</div>
              </div>
            </div>

            <div style="text-align:left; font-size:0.78rem; color:#475569; direction:ltr;">
              <div>${lab.address}</div>
              <div>Tel: ${lab.phone}</div>
              <div>Email: ${lab.email}</div>
            </div>
          </div>

          <!-- بطاقة بيانات المريض والزيارة -->
          <div class="patient-info-box" style="background-color:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px 18px; margin-bottom:18px;">
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px 16px; font-size:0.88rem;">
              <div><span style="color:#64748b; font-weight:600;">اسم المريض:</span> <strong>${patient.name}</strong></div>
              <div><span style="color:#64748b; font-weight:600;">كود المريض:</span> <strong style="font-family:var(--font-mono);">${patient.id}</strong></div>
              <div><span style="color:#64748b; font-weight:600;">السن / النوع:</span> <strong>${patient.age} سنة (${patient.gender === 'male' ? 'ذكر' : 'أنثى'})</strong></div>
              <div><span style="color:#64748b; font-weight:600;">الطبيب المعالج:</span> <strong>${patient.doctor || 'طلب مباشر'}</strong></div>
              <div><span style="color:#64748b; font-weight:600;">تاريخ السحب:</span> <strong>${new Date(order.createdAt).toLocaleDateString('ar-EG')}</strong></div>
              <div><span style="color:#64748b; font-weight:600;">تاريخ الاعتماد:</span> <strong>${order.validatedAt ? new Date(order.validatedAt).toLocaleDateString('ar-EG') : 'مسودة قيد المراجعة'}</strong></div>
            </div>

            <div style="margin-top:10px; border-top:1px dashed #e2e8f0; padding-top:8px; display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:0.8rem; color:#64748b;">
                حالة التقرير: <span style="font-weight:700; color:${order.status === 'validated' ? '#059669' : '#d97706'};">${order.status === 'validated' ? 'معتمد رسمياً للطباعة' : 'تقرير أولي غير معتمد'}</span>
              </div>
              <div>
                ${window.LabBarcode.renderBarcodeSVG(order.barcode, 150, 32)}
              </div>
            </div>
          </div>

          <!-- جداول نتائج الفحوصات الطبية -->
          <div style="margin-bottom:24px;">
            ${order.testsRequested.map(testId => {
              const testObj = window.store.state.tests.find(t => t.id === testId);
              if (!testObj) return '';

              const testResults = order.results[testId] || {};

              return `
                <div style="margin-bottom:18px;">
                  <div class="report-section-title" style="background:#e0f2fe; color:#0369a1; padding:6px 14px; font-weight:800; font-size:0.95rem; border-right:4px solid #0284c7; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span>${testObj.nameAr} (${testObj.nameEn})</span>
                    <span style="font-size:0.8rem; font-weight:600; color:#0284c7;">[ ${testObj.category} ]</span>
                  </div>

                  <table class="print-results-table" style="width:100%; border-collapse:collapse; font-size:0.88rem; margin-bottom:10px;">
                    <thead>
                      <tr style="background:#f1f5f9; border-bottom:1.5px solid #cbd5e1;">
                        <th style="padding:7px 10px; text-align:right; border:1px solid #cbd5e1;">المتغير الطبي (Test Parameter)</th>
                        <th style="padding:7px 10px; text-align:right; border:1px solid #cbd5e1; width:130px;">النتيجة (Result)</th>
                        <th style="padding:7px 10px; text-align:center; border:1px solid #cbd5e1; width:90px;">التقييم (Flag)</th>
                        <th style="padding:7px 10px; text-align:right; border:1px solid #cbd5e1; width:130px;">الوحدة (Unit)</th>
                        <th style="padding:7px 10px; text-align:right; border:1px solid #cbd5e1; width:160px;">المدى الطبيعي (Ref. Range)</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${(testObj.parameters || []).map(param => {
                        const range = window.LabValidator.getParamRange(param, patient ? patient.gender : 'male');
                        const val = testResults[param.key];
                        const evaluation = window.LabValidator.evaluate(val, range.min, range.max);

                        return `
                          <tr style="border-bottom:1px solid #e2e8f0;">
                            <td style="padding:7px 10px; border:1px solid #cbd5e1; font-weight:600; color:#1e293b;">
                              ${param.name}
                            </td>
                            <td style="padding:7px 10px; border:1px solid #cbd5e1; font-family:var(--font-mono); font-weight:800; font-size:0.95rem;">
                              ${val !== undefined && val !== '' ? val : '<span style="color:#94a3b8;">لم يرصد</span>'}
                            </td>
                            <td style="padding:7px 10px; border:1px solid #cbd5e1; text-align:center; font-weight:800; font-size:0.82rem;">
                              ${evaluation.status === 'HIGH' ? '<span class="print-flag-high" style="color:#dc2626; font-weight:900;">▲ HIGH</span>' : ''}
                              ${evaluation.status === 'LOW' ? '<span class="print-flag-low" style="color:#2563eb; font-weight:900;">▼ LOW</span>' : ''}
                              ${evaluation.status === 'NORMAL' ? '<span class="print-flag-normal" style="color:#059669;">NORMAL</span>' : ''}
                              ${evaluation.status === 'EMPTY' ? '-' : ''}
                            </td>
                            <td style="padding:7px 10px; border:1px solid #cbd5e1; font-family:var(--font-mono); color:#475569; font-size:0.82rem;">
                              ${param.unit || '-'}
                            </td>
                            <td style="padding:7px 10px; border:1px solid #cbd5e1; color:#475569; font-size:0.82rem;">
                              ${window.LabValidator.formatRange(range.min, range.max, param.unit)}
                            </td>
                          </tr>
                        `;
                      }).join("")}
                    </tbody>
                  </table>
                </div>
              `;
            }).join("")}
          </div>

          <!-- الملاحظات الطبية للاستشاري -->
          ${order.doctorNotes ? `
            <div style="background:#fffbeb; border:1px solid #fef3c7; border-right:4px solid #f59e0b; border-radius:6px; padding:10px 14px; margin-bottom:20px; font-size:0.85rem;">
              <strong style="color:#92400e; display:block; margin-bottom:4px;">ملاحظات الطبيب الاستشاري:</strong>
              <div style="color:#78350f;">${order.doctorNotes}</div>
            </div>
          ` : ''}

          <!-- تذييل التقرير وتوقيع مدير المعمل والختم -->
          <div class="print-footer-container" style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1.5px dashed #cbd5e1; padding-top:16px; margin-top:20px;">
            <div style="text-align:center; width:220px;">
              <div style="font-weight:800; font-size:0.92rem; color:#1e293b; margin-bottom:28px;">
                استشاري الباثولوجيا ومدير المعمل
              </div>
              <div style="border-top:1px solid #475569; padding-top:4px; font-weight:700; font-size:0.85rem; color:#334155;">
                ${order.validatedBy || lab.directorName}
              </div>
              <div style="font-size:0.75rem; color:#64748b;">${lab.directorTitle}</div>
            </div>

            <!-- ختم المعمل الدائري الرقمي -->
            <div class="lab-stamp-box" style="width:115px; height:115px; border:2.5px dashed #0284c7; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#0284c7; font-weight:800; font-size:0.75rem; text-align:center; transform:rotate(-8deg); background:rgba(2,132,199,0.03);">
              <div style="font-size:0.65rem; border-bottom:1px solid #0284c7; padding-bottom:2px; margin-bottom:2px;">معتمد رسمياً</div>
              <div style="font-size:0.8rem;">${lab.nameAr}</div>
              <div style="font-size:0.65rem; font-family:var(--font-mono);">${order.barcode}</div>
              <div style="font-size:0.6rem; color:#64748b;">OFFICIALLY VALIDATED</div>
            </div>
          </div>

          <div class="print-legal-notice" style="text-align:center; font-size:0.75rem; color:#64748b; margin-top:16px; border-top:1px solid #f1f5f9; padding-top:8px;">
            ${lab.footerNotice}
          </div>

          <!-- شريط حفظ حقوق الطبع والنشر والبرمجة وحماية الملكية الفكرية -->
          <div class="print-copyright-bar" style="margin-top:14px; padding:6px 12px; border-top:1.5px solid #0284c7; display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:#475569; background:#f8fafc; border-radius:4px;">
            <div>
              <strong>سند لتطوير البرمجيات (Sanad Digital)</strong> — تم تطوير وبرمجة النظام: <strong>م/ محمد الدباح</strong> (01501084747)
            </div>
            <div style="direction:ltr; font-family:var(--font-mono); font-size:0.68rem; color:#64748b;">
              All Rights Reserved © 2026 • Encrypted Medical Document
            </div>
          </div>
          <div style="text-align:center; font-size:0.65rem; color:#94a3b8; margin-top:4px;">
            وثيقة طبية رسمية مشفرة بباركود رقمي — يُحظر التلاعب بالنتائج أو نسخ أو إعادة هندسة النظام دون ترخيص كتابي بموجب قوانين حماية الملكية الفكرية.
          </div>
        </div>
      `}
    `;

    if (window.lucide) window.lucide.createIcons();

    this.initEventListeners(activeOrderId);
  },

  initEventListeners(activeOrderId) {
    const container = document.getElementById("view-medical-report");
    if (!container) return;

    // تبديل العينة من القائمة المنسدلة
    const selectOrder = document.getElementById("select-report-order");
    if (selectOrder) {
      selectOrder.addEventListener("change", (e) => {
        const orderId = e.target.value;
        window.store.setView("medical-report", orderId);
      });
    }

    // زر الطباعة
    const printBtn = document.getElementById("btn-trigger-print");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.printDocument('report');
      });
    }

    // زر إرسال واتساب للمريض بالنتيجة
    const waBtn = document.getElementById("btn-whatsapp-notify");
    if (waBtn) {
      waBtn.addEventListener("click", () => {
        const order = window.store.getOrder(activeOrderId);
        const patient = order ? window.store.getPatient(order.patientId) : null;
        const lab = window.store.state.labProfile;

        if (!patient || !patient.phone || patient.phone.trim().length < 6) {
          window.app.showToast("المريض ليس لديه رقم هاتف صحيح مسجل لإرسال واتساب", "error");
          return;
        }

        let phone = patient.phone.replace(/[^0-9]/g, '');
        if (phone.startsWith('01')) {
          phone = '20' + phone.substring(1);
        }

        const testNames = order.testsRequested.map(tId => {
          const t = window.store.state.tests.find(item => item.id === tId);
          return t ? t.nameAr : tId;
        }).join("، ");

        const msg = `السلام عليكم أ/ ${patient.name}،\nنود إعلامكم بأن نتائج تحاليلكم الطبية [${testNames}] بمختبر "${lab.nameAr}" (كود العينة: ${order.barcode}) قد تم فحصها واعتمادها رسمياً وهي جاهزة للاستلام الآن.\nمع تمنياتنا لكم بدوام الصحة والعافية.`;

        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
        window.app.showToast("تم فتح محادثة الواتساب لإرسال الإشعار بنجاح", "success");
      });
    }

    // زر العودة لإدخال النتائج
    const backBtn = document.getElementById("btn-back-to-results");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.store.setView("results", activeOrderId);
      });
    }
  }
};
