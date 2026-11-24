/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * موديول لوحة التحكم والمؤشرات الحية (Dashboard Component)
 */

window.DashboardComponent = {
  render() {
    const container = document.getElementById("view-dashboard");
    if (!container) return;

    const kpis = window.store.getKPIs();
    const orders = window.store.state.orders;

    container.innerHTML = `
      <!-- شبكة المؤشرات الحيوية اليومية -->
      <div class="kpi-grid">
        <div class="kpi-card" style="--kpi-color: var(--primary); --kpi-bg: var(--primary-light);">
          <div class="kpi-icon-box">
            <i data-lucide="users"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">مرضى وزيارات اليوم</div>
            <div class="kpi-value">${kpis.todayPatientsCount}</div>
            <div class="kpi-sub">إجمالي الحالات المسجلة: ${kpis.allOrdersCount}</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: var(--warning); --kpi-bg: var(--warning-light);">
          <div class="kpi-icon-box" style="color:var(--warning-text); background-color:var(--warning-light);">
            <i data-lucide="clock"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">تحاليل قيد التنفيذ</div>
            <div class="kpi-value" style="color:var(--warning);">${kpis.pendingTests}</div>
            <div class="kpi-sub">في انتظار إدخال النتائج</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: var(--success); --kpi-bg: var(--success-light);">
          <div class="kpi-icon-box" style="color:var(--success-text); background-color:var(--success-light);">
            <i data-lucide="check-circle-2"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">تحاليل جاهزة ومعتمدة</div>
            <div class="kpi-value" style="color:var(--success);">${kpis.readyTests}</div>
            <div class="kpi-sub">جاهزة للطباعة والتسليم</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: #059669; --kpi-bg: #ecfdf5;">
          <div class="kpi-icon-box" style="color:#059669; background-color:#d1fae5;">
            <i data-lucide="coins"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">مقبوضات اليوم النقدية</div>
            <div class="kpi-value">${kpis.todayRevenue.toLocaleString()} ج.م</div>
            <div class="kpi-sub">المصروفات اليومية: ${kpis.todayExpenses.toLocaleString()} ج.م</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: var(--danger); --kpi-bg: var(--danger-light);">
          <div class="kpi-icon-box" style="color:var(--danger-text); background-color:var(--danger-light);">
            <i data-lucide="alert-circle"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">متبقي طرف المرضى</div>
            <div class="kpi-value" style="color:var(--danger);">${kpis.totalRemaining.toLocaleString()} ج.م</div>
            <div class="kpi-sub">مديونيات مستحقة التحصيل</div>
          </div>
        </div>
      </div>

      <!-- بطاقة الإجراءات السريعة وجدول أحدث الزيارات -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="activity"></i>
            <span>سجل زيارات وعينات اليوم</span>
          </div>
          <div style="display:flex; gap:10px;">
            <button id="dash-btn-new-order" class="btn btn-primary btn-sm">
              <i data-lucide="plus-circle"></i>
              <span>تسجيل زيارة جديدة</span>
            </button>
          </div>
        </div>

        <!-- جدول الزيارات -->
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>كود العينة / الباركود</th>
                <th>اسم المريض</th>
                <th>السن / النوع</th>
                <th>التحاليل المطلوبة</th>
                <th>الحساب (الصافي / المدفوع / المتبقي)</th>
                <th>الحالة المخبرية</th>
                <th style="text-align:center;">الإجراءات السريعة</th>
              </tr>
            </thead>
            <tbody>
              ${orders.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">
                    لا توجد زيارات مسجلة حتى الآن. اضغط على "تسجيل زيارة جديدة" للبدء.
                  </td>
                </tr>
              ` : orders.slice(0, 10).map(order => {
                const patient = window.store.getPatient(order.patientId) || { name: "غير محدد", age: "-", gender: "-" };
                
                // أسماء التحاليل
                const testNames = order.testsRequested.map(tId => {
                  const t = window.store.state.tests.find(item => item.id === tId);
                  return t ? t.code : tId;
                }).join("، ");

                // شارة الحالة
                let statusBadge = '';
                if (order.status === 'validated') {
                  statusBadge = '<span class="badge badge-success"><i data-lucide="check-check" style="width:14px;height:14px;"></i> معتمد وجاهز</span>';
                } else if (order.status === 'completed') {
                  statusBadge = '<span class="badge badge-info"><i data-lucide="clock" style="width:14px;height:14px;"></i> بانتظار الاعتماد</span>';
                } else {
                  statusBadge = '<span class="badge badge-pending"><i data-lucide="flask-round" style="width:14px;height:14px;"></i> قيد الفحص</span>';
                }

                return `
                  <tr>
                    <td>
                      <div style="font-family:var(--font-mono); font-weight:700; color:var(--primary); font-size:0.95rem;">
                        ${order.barcode}
                      </div>
                      <small style="color:var(--text-muted); font-size:0.75rem;">${order.id}</small>
                    </td>
                    <td>
                      <strong style="font-size:0.95rem;">${patient.name}</strong>
                      <div style="font-size:0.78rem; color:var(--text-muted);">${patient.phone || 'بدون هاتف'}</div>
                    </td>
                    <td>${patient.age} سنة / ${patient.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                    <td>
                      <span title="${testNames}" style="max-width:200px; display:inline-block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        ${testNames}
                      </span>
                    </td>
                    <td>
                      <div><strong>${order.netAmount} ج.م</strong></div>
                      <div style="font-size:0.78rem;">
                        <span style="color:var(--success);">مدفوع: ${order.paidAmount}</span>
                        ${order.remainingAmount > 0 ? `<span style="color:var(--danger); margin-right:6px; font-weight:700;">متبقي: ${order.remainingAmount}</span>` : ''}
                      </div>
                    </td>
                    <td>${statusBadge}</td>
                    <td style="text-align:center;">
                      <div style="display:inline-flex; gap:6px;">
                        <button class="btn btn-outline btn-sm action-enter-results" data-order-id="${order.id}" title="إدخال ومراجعة النتائج">
                          <i data-lucide="edit-3" style="width:14px;height:14px;"></i>
                          <span>النتائج</span>
                        </button>
                        <button class="btn btn-outline btn-sm action-view-report" data-order-id="${order.id}" title="عرض وطباعة التقرير">
                          <i data-lucide="printer" style="width:14px;height:14px;"></i>
                          <span>تقرير</span>
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
    `;

    // تفعيل الأيقونات
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // ربط الأحداث
    const newOrderBtn = document.getElementById("dash-btn-new-order");
    if (newOrderBtn) {
      newOrderBtn.addEventListener("click", () => {
        window.store.setView("reception");
      });
    }

    container.querySelectorAll(".action-enter-results").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const orderId = e.currentTarget.getAttribute("data-order-id");
        window.store.setView("results", orderId);
      });
    });

    container.querySelectorAll(".action-view-report").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const orderId = e.currentTarget.getAttribute("data-order-id");
        window.store.setView("medical-report", orderId);
      });
    });
  }
};
